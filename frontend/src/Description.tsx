import React from "react";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    textAlign: "left",
    maxWidth: 600,
  },
});

export const Description = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <h1>数独 解答プログラム</h1>
      <p>
        スマートフォンのカメラで数独の問題の写真を取るだけで自動で解答してくれます。
        解答順序やヒントも表示してくれます
      </p>
    </Container>
  );
};
