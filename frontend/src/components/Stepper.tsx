import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  stepper: {
    paddingLeft: "5px",
    paddingRight: "5px",
  },
});

const getSteps = () => {
  return ["Upload Image", "Edit Sudoku", "Answer"];
};

export const HorizontalStepper = (props: { step: number }): JSX.Element => {
  const classes = useStyles();
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <Stepper
        activeStep={props.step}
        alternativeLabel
        className={classes.stepper}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
