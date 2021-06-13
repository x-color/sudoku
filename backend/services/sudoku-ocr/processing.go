package main

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"math"

	"gocv.io/x/gocv"
)

func toBinary(grayImg gocv.Mat, dst *gocv.Mat) {
	img := gocv.NewMat()
	defer img.Close()
	gocv.BitwiseNot(grayImg.Clone(), &grayImg)
	gocv.GaussianBlur(grayImg, &img, image.Point{9, 9}, 0, 0, gocv.BorderDefault)
	gocv.AdaptiveThreshold(img.Clone(), &img, 255, gocv.AdaptiveThresholdGaussian, gocv.ThresholdBinary, 11, 2)
	gocv.BitwiseNot(img.Clone(), &img)
	kernel := gocv.GetStructuringElement(gocv.MorphCross, image.Pt(3, 3))
	defer kernel.Close()
	gocv.Dilate(img.Clone(), dst, kernel)
}

func findCorners(binaryImg gocv.Mat) (gocv.PointVector, error) {
	contours := gocv.FindContours(binaryImg, gocv.RetrievalExternal, gocv.ChainApproxSimple)
	for i := 0; i < contours.Size(); i++ {
		curve := contours.At(i)
		if gocv.ContourArea(curve) < float64(binaryImg.Cols()*binaryImg.Rows())*0.3 {
			continue
		}
		peri := gocv.ArcLength(curve, true)
		approx := gocv.ApproxPolyDP(curve, 0.015*peri, true)
		if approx.Size() == 4 {
			return approx, nil
		}
	}
	return gocv.NewPointVector(), errors.New("corners are not found")
}

func orderCorners(corners gocv.PointVector) gocv.PointVector {
	return gocv.NewPointVectorFromPoints([]image.Point{
		corners.At(0),
		corners.At(3),
		corners.At(1),
		corners.At(2),
	})
}

func distance(p1, p2 image.Point) float64 {
	d := p1.Sub(p2)
	return math.Sqrt(float64(d.X*d.X + d.Y*d.Y))
}

func perspectiveTransform(img gocv.Mat, dst *gocv.Mat, corners gocv.PointVector) {
	orderedCorners := orderCorners(corners)
	topLeft := orderedCorners.At(0)
	topRight := orderedCorners.At(1)
	bottomLeft := orderedCorners.At(2)
	bottomRight := orderedCorners.At(3)

	width := int(math.Max(distance(topRight, topLeft), distance(bottomRight, bottomLeft)))
	height := int(math.Max(distance(topRight, bottomRight), distance(topLeft, bottomLeft)))

	dim := gocv.NewPointVectorFromPoints([]image.Point{
		{0, 0},
		{width - 1, 0},
		{0, height - 1},
		{width - 1, height - 1},
	})
	grid := gocv.GetPerspectiveTransform(orderedCorners, dim)
	defer grid.Close()
	gocv.WarpPerspective(img, dst, grid, image.Point{width, height})
}

func removeBorders(grayImg gocv.Mat, dst *gocv.Mat) {
	gocv.Threshold(grayImg, dst, 122, 255, gocv.ThresholdBinary)

	lines := gocv.NewMat()
	defer lines.Close()
	cellSize := float32(grayImg.Cols() / 9)
	gocv.HoughLinesPWithParams(dst.Clone(), &lines, 1, math.Pi/360, 80, cellSize, 5)

	for i := 0; i < lines.Rows(); i++ {
		v := lines.GetVeciAt(i, 0)
		gocv.Line(dst, image.Pt(int(v[0]), int(v[1])), image.Pt(int(v[2]), int(v[3])), color.RGBA{0, 0, 0, 0}, 10)
	}
}

func toCells(img gocv.Mat) []gocv.Mat {
	w := img.Cols() / 9
	h := img.Rows() / 9

	// Cut edges of cell (x: 1%, y:1%)
	dx := w / 200
	dy := h / 200

	i := 0
	cells := make([]gocv.Mat, 81)
	for y := 0; y < 9*h; y += h {
		for x := 0; x < 9*w; x += w {
			cells[i] = img.Region(image.Rect(x+dx, y+dy, x+w-dx, y+h-dy))
			i++
		}
	}

	return cells
}

func containsNumber(img gocv.Mat) bool {
	all := img.Cols() * img.Rows()
	bg := gocv.CountNonZero(img)
	textArea := all - bg

	const rate = 1
	return textArea*100/all > rate
}

func processing(img gocv.Mat, dst *gocv.Mat) error {
	toBinary(img, dst)
	corners, err := findCorners(dst.Clone())
	if err != nil {
		return err
	}
	perspectiveTransform(img, dst, corners)
	removeBorders(dst.Clone(), dst)
	return nil
}

func imageToBytes(img gocv.Mat, format string) ([]byte, error) {
	im, err := img.ToImage()
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	switch format {
	case "jpeg":
		if err = jpeg.Encode(buf, im, nil); err != nil {
			return nil, err
		}
	case "png":
		if err = png.Encode(buf, im); err != nil {
			return nil, err
		}
	default:
		return nil, fmt.Errorf("unsupported image format: %s", format)
	}

	return buf.Bytes(), nil
}
