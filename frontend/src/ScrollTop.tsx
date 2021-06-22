import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export const ScrollTop = () => {
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return trigger ? (
    <div
      onClick={() => {
        window.scrollTo({ top: 0, behavior: `smooth` });
      }}
      className={classes.root}
    >
      <Fab color="primary" size="medium" aria-label="scroll back to top">
        <KeyboardArrowUpIcon />
      </Fab>
    </div>
  ) : (
    <div></div>
  );
};
