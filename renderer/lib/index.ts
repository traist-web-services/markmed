export const parseEvents = (str: string) => {
  if (!str) return [];
  const eventStrings = [...str.matchAll(/@[\d|@]+.*/g)];
  const parsedEvents = eventStrings.map((eventArr) => {
    const [event] = eventArr;
    if (event[1] === "@") {
      let descriptionPortion = event.split("@@");
      return {
        startTime: "0000",
        endTime: "2359",
        description: descriptionPortion,
      };
    }
    if (!event) return;
    const timePortion = event.split(" ")[0].substring(1);
    let descriptionPortion = event.split(" ");
    descriptionPortion.shift();
    let description = descriptionPortion.join(" ");

    let startTime = timePortion;
    let endTime = "";
    if (timePortion.indexOf("-") > -1) {
      startTime = timePortion.split("-")[0];
    }
    if (timePortion.indexOf("-") > -1 && timePortion.split("-")[1].length === 4) {
      endTime = timePortion.split("-")[1];
    } else {
      let endTimeCalc = parseInt(`${startTime[0]}${startTime[1]}`, 10) + 1;
      endTime =
        endTimeCalc > 23
          ? 24 - endTimeCalc + `${startTime[2]}${startTime[3]} (next day)`
          : endTimeCalc + `${startTime[2]}${startTime[3]}`;
    }
    description = description.trim();
    if (/\d{4}-\d{2}-\d{2}.*/.test(description)) {
      description = description.substr(11);
    }
    return {
      description,
      startTime,
      endTime,
    };
  });
  return parsedEvents.sort(
    (a, b) => parseInt(a.startTime) - parseInt(b.startTime)
  );
};

export const parseToDos = (str: string) => {
  if (!str) return [];
  const todosStrings = [...str.matchAll(/\[.{0,1}\].*/g)];
  const todos = todosStrings.map((todo: [string]) => {
    const [thisTodo] = todo;
    return {
      checked: thisTodo[1] !== " " && thisTodo[1] !== "]",
      todo: thisTodo.split("]")[1].trim(),
    };
  });
  return todos;
};
