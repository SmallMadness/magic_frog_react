/**
 * Beispiel-Kartendaten für die Magic-Karten-App
 * Später werden diese durch API-Daten ersetzt
 */
const exampleCards = [
  {
    id: 1,
    name: "Black Lotus",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=382866&type=card",
    manaCost: "{0}",
    type: "Artifact",
    rarity: "Rare",
    text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
    set: "Alpha"
  },
  {
    id: 2,
    name: "Counterspell",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=413585&type=card",
    manaCost: "{U}{U}",
    type: "Instant",
    rarity: "Common",
    text: "Counter target spell.",
    set: "Masters 25"
  },
  {
    id: 3,
    name: "Lightning Bolt",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442125&type=card",
    manaCost: "{R}",
    type: "Instant",
    rarity: "Common",
    text: "Lightning Bolt deals 3 damage to any target.",
    set: "Masters 25"
  },
  {
    id: 4,
    name: "Birds of Paradise",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=485324&type=card",
    manaCost: "{G}",
    type: "Creature — Bird",
    rarity: "Rare",
    text: "{T}: Add one mana of any color.",
    set: "Mystery Booster"
  },
  {
    id: 5,
    name: "Wrath of God",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=413580&type=card",
    manaCost: "{2}{W}{W}",
    type: "Sorcery",
    rarity: "Rare",
    text: "Destroy all creatures. They can't be regenerated.",
    set: "Masters 25"
  },
  {
    id: 6,
    name: "Thoughtseize",
    imageUrl: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=438676&type=card",
    manaCost: "{B}",
    type: "Sorcery",
    rarity: "Rare",
    text: "Target player reveals their hand. You choose a nonland card from it. That player discards that card. You lose 2 life.",
    set: "Iconic Masters"
  }
];

export default exampleCards;
