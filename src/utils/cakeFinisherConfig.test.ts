import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CAKE_CENTER_X,
  CAKE_CENTER_Y,
  CAKE_RADIUS,
  TOPPING_OPTIONS,
  clampToCakeSurface,
  isWithinCakeSurface,
} from './cakeFinisherConfig';

test('cakeFinisherConfig provides expected toppings and surface bounds', () => {
  assert.equal(TOPPING_OPTIONS.length, 6);
  assert.ok(TOPPING_OPTIONS.some((t) => t.type === 'rosette'));
  assert.ok(TOPPING_OPTIONS.some((t) => t.type === 'strawberry'));
  assert.ok(TOPPING_OPTIONS.some((t) => t.type === 'blueberry'));
  assert.ok(TOPPING_OPTIONS.some((t) => t.type === 'chocolate'));
  assert.ok(TOPPING_OPTIONS.some((t) => t.type === 'gold-leaf'));

  // Center is within surface
  assert.equal(isWithinCakeSurface(CAKE_CENTER_X, CAKE_CENTER_Y), true);

  // Border check
  assert.equal(isWithinCakeSurface(CAKE_CENTER_X + CAKE_RADIUS, CAKE_CENTER_Y), true);
  assert.equal(isWithinCakeSurface(CAKE_CENTER_X + CAKE_RADIUS + 5, CAKE_CENTER_Y), false);

  // Clamping
  const clampedInside = clampToCakeSurface(50, 50);
  assert.deepEqual(clampedInside, { x: 50, y: 50 });

  const clampedOutside = clampToCakeSurface(100, 50);
  assert.equal(clampedOutside.x, CAKE_CENTER_X + CAKE_RADIUS);
  assert.equal(clampedOutside.y, CAKE_CENTER_Y);
});
