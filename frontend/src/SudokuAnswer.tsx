import React from "react";
import {
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  Switch,
} from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import { Boards, FillCellProcess, FillMethods } from "./sudoku/types";
import { FocusCell, SudokuBoard } from "./SudokuBoard";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { CtrlButtons } from "./CtrlButtons";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4dabf5",
    },
    secondary: {
      main: "#ffa733",
    },
  },
});

const useStyles = makeStyles({
  root: {
    textAlign: "left",
    maxWidth: 600,
  },
  stepper: {
    flexGrow: 1,
  },
  stepperButton: {
    display: "flex",
  },
  center: {
    textAlign: "center",
  },
  left: {
    textAlign: "left",
  },
});

export type SudokuAnswerProps = {
  history: Boards;
  onClickBackButton: () => void;
};

export const SudokuAnswer = (props: SudokuAnswerProps) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [displayHintMode, setDisplayHintMode] = React.useState(false);
  const [displayFilledCellMode, setDisplayFilledCellMode] =
    React.useState(false);
  const [SBCStepIndex, setSBCStepIndex] = React.useState(0);

  const SBCSteps = props.history
    .map((board, i) =>
      (board.process as FillCellProcess)?.id === FillMethods.FillTemporary
        ? i
        : -1
    )
    .filter((v) => v !== -1);

  const handleFirst = React.useCallback(() => {
    setActiveStep(() => 0);
  }, []);

  const handleBack = React.useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleNext = React.useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleLast = React.useCallback(() => {
    setActiveStep(() => props.history.length - 1);
  }, [props.history.length]);

  const handlerSBC = React.useCallback(() => {
    setSBCStepIndex((pre) => pre + 1);
  }, []);

  const handlerHintMode = React.useCallback(() => {
    setDisplayHintMode((pre) => !pre);
  }, []);

  const handlerFilledMode = React.useCallback(() => {
    setDisplayFilledCellMode((pre) => !pre);
  }, []);

  const focusCells = () => {
    const focusCells: FocusCell[] = [];

    if (displayFilledCellMode && activeStep !== 0) {
      focusCells.push({
        i: (props.history[activeStep].process as FillCellProcess).i,
        color: "primary",
      });
    }

    if (
      displayHintMode &&
      activeStep + 1 < props.history.slice(0, SBCSteps[SBCStepIndex]).length
    ) {
      focusCells.push({
        i: (props.history[activeStep + 1].process as FillCellProcess).i,
        color: "secondary",
      });
    }

    return focusCells;
  };

  return (
    <Container className={classes.root}>
      <ThemeProvider theme={theme}>
        <SudokuBoard
          grid={props.history
            .slice(0, SBCSteps[SBCStepIndex])
            [activeStep].grid.map((cell) => cell.value)}
          initGrid={props.history[0].grid.map((cell) => cell.value)}
          focus={focusCells()}
        />
      </ThemeProvider>
      <ProgressMobileStepper
        steps={props.history.slice(0, SBCSteps[SBCStepIndex]).length}
        activeStep={activeStep}
        clickFirst={handleFirst}
        clickBack={handleBack}
        clickNext={handleNext}
        clickLast={handleLast}
      ></ProgressMobileStepper>
      <ThemeProvider theme={theme}>
        <ModeSwitches
          hintMode={displayHintMode}
          filledMode={displayFilledCellMode}
          handlerOnChangeHintSwitch={handlerHintMode}
          handlerOnChangeFilledSwitch={handlerFilledMode}
        ></ModeSwitches>
      </ThemeProvider>
      <CtrlButtons
        leftLabel="BACK"
        rightLabel="仮置きを実施"
        handlerOnClickLeft={props.onClickBackButton}
        handlerOnClickRight={handlerSBC}
        disableRight={activeStep !== SBCSteps[SBCStepIndex] - 1}
      ></CtrlButtons>
    </Container>
  );
};

type ProgressMobileStepperProps = {
  steps: number;
  activeStep: number;
  clickFirst: () => void;
  clickBack: () => void;
  clickNext: () => void;
  clickLast: () => void;
};

const ProgressMobileStepper = (props: ProgressMobileStepperProps) => {
  const classes = useStyles();
  const lastStep = props.steps - 1;
  return (
    <MobileStepper
      variant="progress"
      steps={props.steps}
      position="static"
      activeStep={props.activeStep}
      className={classes.stepper}
      nextButton={
        <div className={classes.stepperButton}>
          <IconButton
            size="small"
            onClick={props.clickNext}
            disabled={props.activeStep === lastStep}
          >
            <KeyboardArrowRight fontSize="large" />
          </IconButton>
          <IconButton
            size="small"
            onClick={props.clickLast}
            disabled={props.activeStep === lastStep}
          >
            <LastPageIcon fontSize="large" />
          </IconButton>
        </div>
      }
      backButton={
        <div className={classes.stepperButton}>
          <IconButton
            size="small"
            onClick={props.clickFirst}
            disabled={props.activeStep === 0}
          >
            <FirstPageIcon fontSize="large" />
          </IconButton>
          <IconButton
            size="small"
            onClick={props.clickBack}
            disabled={props.activeStep === 0}
          >
            <KeyboardArrowLeft fontSize="large" />
          </IconButton>
        </div>
      }
    />
  );
};

type ModeSwitchesProps = {
  hintMode: boolean;
  filledMode: boolean;
  handlerOnChangeHintSwitch: () => void;
  handlerOnChangeFilledSwitch: () => void;
};

const ModeSwitches = (props: ModeSwitchesProps) => {
  const classes = useStyles();
  return (
    <Grid container spacing={3} className={classes.center}>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Switch
              checked={props.hintMode}
              onChange={props.handlerOnChangeHintSwitch}
            />
          }
          label="ヒント"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={props.filledMode}
              onChange={props.handlerOnChangeFilledSwitch}
            />
          }
          label="確定マス"
        />
      </Grid>
    </Grid>
  );
};
