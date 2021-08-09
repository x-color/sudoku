package main

import (
	"gocv.io/x/gocv"
	"golang.org/x/sync/errgroup"
)

type cell string

func toSudoku(img gocv.Mat, format string) ([]cell, error) {
	// Tesseract wants an image that text is black and background is white.
	// So, it replaces color of text and background.
	gocv.BitwiseNot(img, &img)

	cells := make([]cell, 81)
	eg := errgroup.Group{}
	for i, c := range toCells(img) {
		i := i
		c := c.Clone()
		eg.Go(func() error {
			client, err := newGosseractClient()
			if err != nil {
				return err
			}
			defer client.Close()
			if !containsNumber(c) {
				cells[i] = ""
				return nil
			}

			b, err := imageToBytes(c.Clone(), format)
			if err != nil {
				return err
			}

			text, err := recognize(client, b)
			if err != nil {
				return err
			}
			cells[i] = cell(text)
			return nil
		})
	}

	if err := eg.Wait(); err != nil {
		return nil, err
	}

	return cells, nil
}
