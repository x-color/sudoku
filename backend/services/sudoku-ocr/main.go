package main

import (
	"fmt"

	"gocv.io/x/gocv"
)

func toSudoku(img gocv.Mat, format string) ([]cell, error) {
	client, err := newGosseractClient()
	if err != nil {
		return nil, err
	}
	defer client.Close()

	// Tesseract wants an image that text is black and background is white.
	// So, it replaces color of text and background.
	gocv.BitwiseNot(img, &img)

	cells := make([]cell, 81)
	for i, c := range toCells(img) {
		if !containsNumber(c) {
			cells[i] = cell{i % 9, i / 9, ""}
			continue
		}

		b, err := imageToBytes(c.Clone(), format)
		if err != nil {
			return nil, err
		}

		// TODO: recognize() is too late
		text, err := recognize(client, b)
		if err != nil {
			return nil, err
		}
		cells[i] = cell{i % 9, i / 9, text}
	}

	return cells, nil
}

func handler() {
	img := gocv.IMRead("./images/image.jpg", gocv.IMReadGrayScale)
	defer img.Close()

	result := gocv.NewMat()
	defer result.Close()

	const format = "jpeg"

	processing(img, &result)

	cells, err := toSudoku(result, format)
	if err != nil {
		fmt.Println(err)
		return
	}

	display(cells)
}

func main() {
	handler()
}

func display(cells []cell) {
	for i, v := range cells {
		if i != 0 && i%9 == 0 {
			fmt.Println()
		}
		if v.Number == "" {
			fmt.Print(". ")
		} else {
			fmt.Printf("%v ", v.Number)
		}
	}
	fmt.Println()
}

type cell struct {
	X      int
	Y      int
	Number string
}

type response struct {
	cells []cell
}
