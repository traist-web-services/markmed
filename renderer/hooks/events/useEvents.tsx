import { promises as fs } from "fs";
import {
  addDays,
  addHours,
  endOfDay,
  formatISO,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";
import { useContext } from "react";
import { AppStateContext } from "../../contexts/AppContext";

interface Event {
  startTime: Date;
  endTime: Date;
  description: string;
  fromFile: string;
  fromFilePath: string;
  allDay: boolean;
}

export default function useEvents() {
  const { notesFilesFlat } = useContext(AppStateContext);
  const eventRegex = /@(\d+|\d{4}-\d{4}|@) (\d{4}-\d{2}-\d{2} ){0,1}(.*)/;

  const parseEvent = (
    eventString: string,
    fromFilePath: string,
    fromFile?: string
  ): Event => {
    const [_, time, date, description] = eventString.match(eventRegex);

    const eventDate =
      (date && parseISO(date)) ??
      (fromFile && parseISO(fromFile)) ??
      new Date();

    let startTime = null;
    let endTime = null;
    let allDay = false;
    if (time === "@") {
      startTime = startOfDay(eventDate);
      endTime = endOfDay(eventDate);
      allDay = true;
    } else if (time.indexOf("-") < 0) {
      // End time is not specified, start time is specified as HHmm
      startTime = parse(time, "HHmm", eventDate);
      endTime = addHours(startTime, 1);
    } else {
      let textStartTime = time.split("-")[0];
      let textEndTime = time.split("-")[1];
      startTime = parse(textStartTime, "HHmm", eventDate);
      endTime = parse(textEndTime, "HHmm", eventDate);
      if (startTime > endTime) {
        endTime = addDays(endTime, 1);
      }
    }

    const event: Event = {
      startTime,
      endTime,
      description,
      allDay,
      fromFile,
      fromFilePath,
    };

    return event;
  };

  const parseEvents = (
    longString: string,
    fromFilePath: string,
    fromFile?: string
  ) => {
    return longString
      .split("\n")
      .map((el) => {
        if (isEvent(el)) {
          return parseEvent(el, fromFilePath, fromFile);
        }
      })
      .filter((el) => el)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const isEvent = (eventString: string): Boolean => {
    return eventRegex.test(eventString);
  };

  const findEventsAllFiles = async (
    currentDateAsString: string
  ): Promise<Event[]> => {
    const events = await Promise.all(
      notesFilesFlat.map(async (file) => {
        if (file.type === "folder") {
          return;
        }
        const fileDate = file.name.substring(0, file.name.length - 3);
        if (fileDate === currentDateAsString) {
          return [];
        }
        const data = await fs.readFile(file.path, "utf-8");
        return parseEvents(data, file.path, fileDate).filter(
          (event) =>
            formatISO(event.startTime, { representation: "date" }) ===
            currentDateAsString
        );
      })
    );
    return events.flat();
  };

  return {
    parseEvent,
    parseEvents,
    isEvent,
    findEventsAllFiles,
  };
}
