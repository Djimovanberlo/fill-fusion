type Duration = "Q" | "8";

type Hand = "R" | "L";

const createNote = (duration: Duration, hand: Hand) => {
  return { key: "b/4", duration, hand };
};
