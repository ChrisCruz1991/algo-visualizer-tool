"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  AlgorithmModule,
  AlgorithmStep,
  EngineStatus,
  SortSearchModule,
  GraphModule,
  TreeModule,
  PresetGraph,
  PresetTree,
} from "./types";

export type StepEngineOptions =
  | { category: "sorting" | "searching"; input: number[]; target?: number }
  | { category: "graph"; graph: PresetGraph; startNodeId: string }
  | { category: "tree"; tree: PresetTree };

export type StepEngineResult = {
  status: EngineStatus;
  currentStep: AlgorithmStep | null;
  stepIndex: number;
  totalSteps: number;
  play: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
  speed: number;
};

function collectSteps(
  module: AlgorithmModule,
  options: StepEngineOptions
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let gen: Generator<AlgorithmStep>;

  if (options.category === "sorting" || options.category === "searching") {
    gen = (module as SortSearchModule).generator(
      options.input,
      options.target
    ) as Generator<AlgorithmStep>;
  } else if (options.category === "graph") {
    gen = (module as GraphModule).generator(
      options.graph,
      options.startNodeId
    ) as Generator<AlgorithmStep>;
  } else if (options.category === "tree") {
    gen = (module as TreeModule).generator(
      options.tree
    ) as Generator<AlgorithmStep>;
  } else {
    throw new Error("Unknown algorithm category");
  }

  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

export function useStepEngine(
  algorithmModule: AlgorithmModule,
  options: StepEngineOptions
): StepEngineResult {
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeedState] = useState(300);

  // Refs to avoid stale closures in setInterval
  const stepIndexRef = useRef(0);
  const stepsRef = useRef<AlgorithmStep[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef<EngineStatus>("idle");

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Eager step collection whenever options or algorithm changes
  useEffect(() => {
    clearTimer();
    const steps = collectSteps(algorithmModule, options);
    stepsRef.current = steps;
    stepIndexRef.current = 0;
    setStepIndex(0);
    setStatus("idle");
    statusRef.current = "idle";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmModule, options, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const startInterval = useCallback(
    (delay: number) => {
      clearTimer();
      intervalRef.current = setInterval(() => {
        const next = stepIndexRef.current + 1;
        if (next >= stepsRef.current.length) {
          clearTimer();
          setStatus("done");
          statusRef.current = "done";
        } else {
          stepIndexRef.current = next;
          setStepIndex(next);
        }
      }, delay);
    },
    [clearTimer]
  );

  const play = useCallback(() => {
    if (statusRef.current === "done") {
      // Restart from beginning
      stepIndexRef.current = 0;
      setStepIndex(0);
    }
    setStatus("running");
    statusRef.current = "running";
    startInterval(speed);
  }, [speed, startInterval]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus("paused");
    statusRef.current = "paused";
  }, [clearTimer]);

  const step = useCallback(() => {
    if (statusRef.current !== "paused" && statusRef.current !== "idle") return;
    const next = stepIndexRef.current + 1;
    if (next >= stepsRef.current.length) {
      setStatus("done");
      statusRef.current = "done";
    } else {
      stepIndexRef.current = next;
      setStepIndex(next);
      if (statusRef.current === "idle") {
        setStatus("paused");
        statusRef.current = "paused";
      }
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    stepIndexRef.current = 0;
    setStepIndex(0);
    setStatus("idle");
    statusRef.current = "idle";
  }, [clearTimer]);

  const setSpeed = useCallback(
    (ms: number) => {
      const clamped = Math.max(50, ms);
      setSpeedState(clamped);
      if (statusRef.current === "running") {
        startInterval(clamped);
      }
    },
    [startInterval]
  );

  const currentStep = stepsRef.current[stepIndex] ?? null;
  const totalSteps = stepsRef.current.length;

  return {
    status,
    currentStep,
    stepIndex,
    totalSteps,
    play,
    pause,
    step,
    reset,
    setSpeed,
    speed,
  };
}
