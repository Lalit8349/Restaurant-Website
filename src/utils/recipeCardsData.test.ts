import test from 'node:test';
import assert from 'node:assert/strict';
import { getRecipeCard, RECIPE_CARDS_DATA } from './recipeCardsData';
import { STORY_BEATS } from './storyTimeline';

test('every detail tag in STORY_BEATS has a corresponding RecipeCard entry', () => {
  const allTags = new Set<string>();
  for (const beat of STORY_BEATS) {
    for (const tag of beat.details) {
      allTags.add(tag);
    }
  }

  for (const tag of allTags) {
    const card = getRecipeCard(tag);
    assert.ok(card, `Tag "${tag}" should have a valid recipe card`);
    assert.ok(card.title.length > 0, `Tag "${tag}" should have a non-empty title`);
    assert.ok(card.story.length > 20, `Tag "${tag}" should have a descriptive story`);
    assert.ok(card.bakingTrivia.length > 20, `Tag "${tag}" should have technical trivia`);
    assert.ok(card.details.length >= 2, `Tag "${tag}" should have at least 2 detail badges`);
  }
});

test('getRecipeCard handles case-insensitive lookups and trims gracefully', () => {
  const wheatUpper = getRecipeCard('WHEAT');
  assert.ok(wheatUpper);
  assert.equal(wheatUpper.tag, 'Wheat');

  const padded = getRecipeCard('  Stone-Milled Flour  ');
  assert.ok(padded);
  assert.equal(padded.tag, 'Stone-Milled Flour');

  const invalid = getRecipeCard('NonExistentIngredientXYZ');
  assert.equal(invalid, null);
});

test('RECIPE_CARDS_DATA covers essential bakery categories', () => {
  const categories = new Set(Object.values(RECIPE_CARDS_DATA).map((c) => c.category));
  assert.ok(categories.has('Farm & Harvest'));
  assert.ok(categories.has('Mill & Hearth'));
  assert.ok(categories.has('Courier & Craft'));
  assert.ok(categories.has('Grand Service'));
});
