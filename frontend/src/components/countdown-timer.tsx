"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState(0);

  const deadline = new Date("2024-12-22T19:30:00.000Z");
  const isFinalDeadlinePassed = new Date() > deadline;

  useEffect(() => {
    setTimeRemaining(
      Math.floor((deadline.getTime() - new Date().getTime()) / 1000),
    );
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(timeRemaining / 86400);
  const hours = Math.floor((timeRemaining % 86400) / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const daysUnit = (days: number) => {
    if (days > 0) {
      const rule = new Intl.PluralRules("pl").select(days);
      let unit = "dni";
      if (rule === "one") unit = "dzień";
      return unit;
    }
    return "";
  };

  const hoursUnit = (hours: number) => {
    const rule = new Intl.PluralRules("pl").select(hours);
    let unit = "godzin";
    if (rule === "one") unit = "godzina";
    if (rule === "few") unit = "godziny";
    return unit;
  };

  const minutesUnit = (minutes: number) => {
    const rule = new Intl.PluralRules("pl").select(minutes);
    let unit = "minut";
    if (rule === "one") unit = "minuta";
    if (rule === "few") unit = "minuty";
    return unit;
  };

  const secondsUnit = (seconds: number) => {
    const rule = new Intl.PluralRules("pl").select(seconds);
    let unit = "sekund";
    if (rule === "one") unit = "sekunda";
    if (rule === "few") unit = "sekundy";
    return unit;
  };

  return (
    <div className="mx-6 flex flex-col items-center gap-1">
      {!isFinalDeadlinePassed ? (
        <>
          <div className="whitespace-nowrap">Do końca licytacji zostało:</div>
          <div
            className={`grid ${
              days > 0
                ? "grid-cols-[repeat(4,_4.25rem)]"
                : hours > 0
                  ? "grid-cols-[repeat(3,_4.25rem)]"
                  : minutes > 0
                    ? "grid-cols-[repeat(2,_4.25rem)]"
                    : "grid-cols-[4.25rem]"
            }`}
          >
            {days > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{days}</span>
                <span>{daysUnit(days)}</span>
              </div>
            )}
            {(hours > 0 || days > 0) && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{hours}</span>
                <span>{hoursUnit(hours)}</span>
              </div>
            )}
            {(minutes > 0 || hours > 0 || days > 0) && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{minutes}</span>
                <span>{minutesUnit(minutes)}</span>
              </div>
            )}
            {(seconds > 0 || minutes > 0 || hours > 0 || days > 0) && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{seconds}</span>
                <span>{secondsUnit(seconds)}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-balance text-center text-2xl font-bold">
            Licytacje zakończone! Dziękujemy za udział! ❤️
          </span>
        </div>
      )}
    </div>
  );
}
