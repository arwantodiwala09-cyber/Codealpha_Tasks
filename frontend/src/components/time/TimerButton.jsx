import { useState } from "react";

import {
  Play,
  Square,
  Loader2,
} from "lucide-react";

import {
  startTimer,
  stopTimer,
} from "../../services/timeLogService";

export default function TimerButton({
  taskId,
}) {
  const [
    running,
    setRunning,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleStart =
    async () => {
      try {
        setLoading(true);

        await startTimer(taskId);

        setRunning(true);
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Unable to start timer"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleStop =
    async () => {
      try {
        setLoading(true);

        await stopTimer();

        setRunning(false);
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Unable to stop timer"
        );
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <button
        disabled
        className="
          flex
          items-center
          gap-2
          bg-slate-700
          px-4
          py-2
          rounded-xl
          text-sm
        "
      >
        <Loader2
          size={16}
          className="animate-spin"
        />
        Loading...
      </button>
    );
  }

  return running ? (
    <button
      onClick={
        handleStop
      }
      className="
        flex
        items-center
        gap-2
        bg-red-600
        hover:bg-red-700
        px-4
        py-2
        rounded-xl
        text-sm
        font-semibold
        transition
      "
    >
      <Square
        size={16}
      />
      Stop Timer
    </button>
  ) : (
    <button
      onClick={
        handleStart
      }
      className="
        flex
        items-center
        gap-2
        bg-green-600
        hover:bg-green-700
        px-4
        py-2
        rounded-xl
        text-sm
        font-semibold
        transition
      "
    >
      <Play
        size={16}
      />
      Start Timer
    </button>
  );
}