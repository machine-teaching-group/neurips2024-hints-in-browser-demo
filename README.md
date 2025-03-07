# Hints-in-Browser Demo App

A companion demo app to our NeurIPS '24 submission that showcases our in-browser hint generation pipeline.

## Installation
This app was developed using [Vite](https://vitejs.dev/). Install and run locally using
```
npm install
npm run dev
```

## Code highlights
We briefly point out some files that contain the core parts of our app's functionality.
Unless specifically stated, all files discussed below are under the `src/` top-level directory.

### Hint generation
The majority of our code repair and hint generation functionality is contained in `use-llm.ts`.
Function `pipeline` inside the React hook `useLLM` executes the main high-level steps required to generate a hint.
The in-browser language model inference is powered by [WebLLM](https://webllm.mlc.ai/).

In addition, our prompts and related helpers can be found in `prompt.ts`, while the model configurations are in `config.ts`.

### Python code execution
The majority of our code execution functionality is contained in `use-pyodide.ts`, and is powered by [Pyodide](https://pyodide.org/).
Function `runPython` inside React hook `usePyodide` executes a test suite on a given Python program, and returns the results of said execution.
The complex handling of different execution results in enabled by a custom library that we run in-browser using Pyodide.

### Models
The model configurations are specified in `config.ts`, and follow the structure used by WebLLM (see [https://github.com/mlc-ai/web-llm/blob/main/src/config.ts](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts)).
To preserve anonymity during the review process, we have omitted the configurations corresponding to our fine-tuned version of the models.
The only fields that change for the fine-tuned models, are
* `model`: the URL of the deployed model (e.g. on Hugging Face)
* `model_id`: a string that identifies the fine-tuned model (can be chosen arbitrarily)

### Data
The task details and corresponding test suites for the two data sets used in the app, *IntroPyNUS* and *BasicAlgo*, can be found under `data/`.

## Deployment info
We are hosting our fine-tuned models on [Hugging Face](https://huggingface.co/), and have deployed our app on [Netlify](https://www.netlify.com/).
You can find our deployment at [https://hints-in-browser.netlify.app](https://hints-in-browser.netlify.app).

Deploying your own version of this app is as simple as running `npm build`, and serving the resulting `dist/` directory on your favorite web hosting service.