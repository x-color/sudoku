import React from "react";
import { Button, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  center: {
    textAlign: "center",
  },
});

type CtrlButtonsProps = {
  handlerOnClickLeft: () => void;
  handlerOnClickRight: () => void;
  leftLabel: string;
  rightLabel: string;
  disableLeft?: boolean;
  disableRight?: boolean;
};

export const CtrlButtons = (props: CtrlButtonsProps) => {
  const classes = useStyles();
  return (
    <Grid container spacing={3} className={classes.center}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          disabled={props.disableLeft}
          onClick={props.handlerOnClickLeft}
        >
          {props.leftLabel}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          disabled={props.disableRight}
          onClick={props.handlerOnClickRight}
        >
          {props.rightLabel}
        </Button>
      </Grid>
    </Grid>
  );
};
