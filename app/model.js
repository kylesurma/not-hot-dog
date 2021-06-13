import * as tf from '@tensorflow/tfjs'
let model


export const modelLoader = async () => {
  console.log('running...')
  model = await tf.loadGraphModel('model/model.json')
  console.log('Model Loaded')
}

export const getPrediction = async (image) => {
  const tensor = tf.browser.fromPixels(image, 3)
  .resizeNearestNeighbor([224, 224])
  .expandDims()
  .toFloat()
  .reverse() //
  let prediction = await model.predict(tensor).data()
  return prediction
}
