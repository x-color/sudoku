package main

import (
	"strings"

	"github.com/otiai10/gosseract"
)

func newGosseractClient() (*gosseract.Client, error) {
	client := gosseract.NewClient()
	if err := client.SetPageSegMode(gosseract.PSM_SINGLE_CHAR); err != nil {
		return nil, err
	}
	if err := client.SetLanguage("snum"); err != nil {
		return nil, err
	}
	if err := client.SetWhitelist("123456789"); err != nil {
		return nil, err
	}
	return client, nil
}

func recognize(client *gosseract.Client, img []byte) (string, error) {
	if err := client.SetImageFromBytes(img); err != nil {
		return "", err
	}

	text, err := client.Text()
	if err != nil {
		return "", err
	}
	text = strings.TrimSpace(text)
	if len(text) != 1 {
		return "", nil
	}
	return text, nil
}
