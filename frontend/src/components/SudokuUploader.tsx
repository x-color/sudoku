import React from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Board, Cell, Position, SudokuNumber } from "../sudoku/types";
import axios, { AxiosError } from "axios";
import Resizer from "react-image-file-resizer";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
  },
  center: {
    textAlign: "center",
  },
  text: {
    marginBottom: "20px",
  },
  input: {
    display: "none",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const resizeImage = (image: File): Promise<string> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      1000,
      1000,
      "JPEG",
      100,
      0,
      (uri) => {
        if (typeof uri === "string") {
          resolve(uri.split(",")[1]);
        }
      },
      "base64"
    );
  });

type SudokuUploaderProps = {
  setInitBoard: (board: Board) => void;
};

export const SudokuUploader = (props: SudokuUploaderProps) => {
  const classes = useStyles();
  const [uploading, setUploading] = React.useState<boolean>(false);

  const handlerNoUpload = () => {
    props.setInitBoard({
      grid: [...Array(81)].map((_, i): Cell => {
        return {
          i: i as Position,
          value: "",
          candidates: [...Array(9)].map(
            (_, i) => (i + 1).toString() as SudokuNumber
          ),
          difficulty: 1,
        };
      }),
      process: null,
    });
  };

  const handlerUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (process.env.REACT_APP_API_ENDPOINT === undefined) {
        console.log("error: invalid url of api server");
        return;
      }
      if (!e.target.files?.length) {
        return;
      }

      setUploading(true);
      const base64Image = await resizeImage(e.target.files[0]);
      console.log(base64Image.length);
      const res = await axios
        .post<{ cells: SudokuNumber[] }>(
          process.env.REACT_APP_API_ENDPOINT,
          { image: base64Image },
          { timeout: 30000 }
        )
        .catch((e: AxiosError<{ error: string }>) => {
          if (e.response) {
            console.log(`error: ${e.response.data.error}`);
          }
        });
      setUploading(false);

      if (!res) {
        console.log("error: invalid response");
        return;
      }

      const board = {
        grid: res.data.cells.map((v, i): Cell => {
          return {
            i: i as Position,
            value: v,
            candidates: [...Array(9)].map(
              (_, i) => (i + 1).toString() as SudokuNumber
            ),
            difficulty: 1,
          };
        }),
        process: null,
      };
      props.setInitBoard(board);
    },
    [props]
  );

  return (
    <Container className={classes.root}>
      <Container className={classes.text}>
        <h2>サイトについて</h2>
        自動で数独を解くことができるサイトです。ヒント表示なども可能です。
        <ul>
          <li>難しい数独の解答が知りたい！</li>
          <li>次にどのマスが埋まるかが知りたい！</li>
        </ul>
        といったときにご利用ください。
        <h2>モードについて</h2>
        <ul>
          <li>
            <b>[UPLOAD]</b>:
            数独の画像をアップロードすることで、自動で数字を埋めてくれます
          </li>
          <li>
            <b>[NOT UPLOAD]</b>: ユーザ自身が数字を埋める必要があります
          </li>
        </ul>
        <b>※注意点</b>:
        [UPLOAD]モードは少々時間がかかります。また、画像によってはうまく認識できないこともありますので、アップロード後に数字があっているか確認してください。
      </Container>
      <Backdrop className={classes.backdrop} open={uploading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={3} className={classes.center}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handlerNoUpload}>
            NO UPLOAD
          </Button>
        </Grid>
        <Grid item xs={6}>
          <input
            accept=".jpg,.png,image/jpeg,image/png"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={handlerUpload}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              UPLOAD
            </Button>
          </label>
        </Grid>
      </Grid>
    </Container>
  );
};
