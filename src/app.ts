interface Card {
  id: number;
  title: string;
  text: string;
}

const cards: Card[] = [
  {
    id: 0,
    title: "Hello 0",
    text: "world 0",
  },
  {
    id: 1,
    title: "Hello 1",
    text: "world 1",
  },
];

function showInfoOfCard(card: Card): void {
  const { id, title, text } = card;
  
  console.log(`ID: ${id} \nTitle: ${title}\nText: ${text}` + 1);
}

for (let i = 0; i < cards.length; i++) {
  showInfoOfCard(cards[i]);
}