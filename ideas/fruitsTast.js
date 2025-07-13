const showInfo = (apples = 5, pears = 9) => {
  let fruits;
  
  const apple = "🍎";
  const pear = "🍐";
  const fruit = "🥗";

  fruits = apples + pears;
  let result = 
    `Apples\t=\t${apple.repeat(apples)} (${apples}),\n`+
    `Pears\t=\t${pear.repeat(pears)} (${pears}),\n`+
    `All\t=\t${fruit.repeat(fruits)} (${fruits}).\n`;
  console.log(result);

  return [apples, pears];
};

const [apples, pears] = showInfo();

// Alt+Shift+Down

const tumblerIs = (tumbler) => {
  const off = "❕";
  const on = "❗️";
  
  return tumbler ? off : on;
};

console.log(
  "Tumbler: " +
    tumblerIs(apples > pears) +
    (apples > pears
      ? ` Apples more on: ${apples - pears}`
      : ` Pears more on: ${pears - apples}`)
);
