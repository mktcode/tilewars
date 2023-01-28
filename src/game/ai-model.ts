import * as tf from '@tensorflow/tfjs';

/**
 * Inputs:
 * - all tiles
 *   - neurons from 1 to 50 represent tiles (modulo 5 to get the x and divide by 5 to get the y)
 *   - a neuron/tile is
 *     - 0: empty
 *     - 0.1: p1 base
 *     - 0.2: p1 tank
 *     - 0.3: p1 soldier
 *     - 0.4: p1 fighter
 *     - 0.5: p2 base
 *     - 0.6: p2 tank
 *     - 0.7: p2 soldier
 *     - 0.8: p2 fighter
 * 
 * Outputs:
 * - Player 2 next unit position
 *   - one neuron: between 0 to 1 (representing the neuron number)
 *     - 0: tile 0 (1, 1)
 *     - 1: tile 50 (5, 10)
 *     - 0.5: tile 25 (5, 5)
 *     - ...
 */
export function getEmptyAiModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 32, inputShape: [50] }));
  model.add(tf.layers.dense({ units: 32 }));
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  return model;
}

export function mutateWeights(weights: tf.Tensor[], diviationRate: number, probability = 1) {
  const mutatedWeights = [];
  for (let i = 0; i < weights.length; i++) {
    const tensor = weights[i];
    const shape = tensor.shape;
    const values = tensor.dataSync();
    for (let j = 0; j < values.length; j++) {
      if (Math.random() < 1 - probability) {
        values[j] += (Math.random() - 0.5) * diviationRate;
      }
    }
    const newTensor = tf.tensor(values, shape);
    mutatedWeights[i] = newTensor;
  }
  
  return mutatedWeights;
}

export function predictTurn(model: tf.Sequential, tiles: number[]) {
  const input = tf.tensor1d(tiles).reshape([1, 50]);
  const output = model.predict(input);
  const outputValue = output.dataSync();
  
  return outputValue;
}