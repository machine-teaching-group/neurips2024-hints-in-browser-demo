import * as webllm from '@mlc-ai/web-llm'

export const configTiny: webllm.ModelRecord = {
  model: 'https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC',
  model_id: 'TinyLlama-1.1B-Chat',
  model_lib:
    webllm.modelLibURLPrefix +
    webllm.modelVersion +
    '/TinyLlama-1.1B-Chat-v0.4-q4f16_1-ctx1k_cs1k-webgpu.wasm',
  vram_required_MB: 675.24,
  low_resource_required: true,
  required_features: ['shader-f16'],
}

const Llama3Wasm = '/Llama-3-8B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm'

export const configLlama: webllm.ModelRecord = {
  model: 'https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f16_1-MLC',
  model_id: 'Llama-3-8B-web',
  model_lib: webllm.modelLibURLPrefix + webllm.modelVersion + Llama3Wasm,
  vram_required_MB: 4598.34,
  low_resource_required: true,
}

export const configLlamaNus: webllm.ModelRecord = {
  model:
    'https://huggingface.co/machine-teaching-group/Llama-3-8B-IntroPyNUS-web',
  model_id: 'Llama-3-8B-IntroPyNUS-web',
  model_lib: webllm.modelLibURLPrefix + webllm.modelVersion + Llama3Wasm,
  vram_required_MB: 4598.34,
  low_resource_required: true,
}

export const configLlamaBasic: webllm.ModelRecord = {
  model:
    'https://huggingface.co/machine-teaching-group/Llama-3-8B-BasicAlgo-web',
  model_id: 'Llama-3-8B-BasicAlgo-web',
  model_lib: webllm.modelLibURLPrefix + webllm.modelVersion + Llama3Wasm,
  vram_required_MB: 4598.34,
  low_resource_required: true,
}

const Phi3Wasm = '/Phi-3-mini-4k-instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm'

export const configPhi: webllm.ModelRecord = {
  model: 'https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f16_1-MLC',
  model_id: 'Phi-3-3.8B-web',
  model_lib: webllm.modelLibURLPrefix + webllm.modelVersion + Phi3Wasm,
  vram_required_MB: 2520.07,
  low_resource_required: true,
}

export const configPhiNUS: webllm.ModelRecord = {
  model:
    'https://huggingface.co/machine-teaching-group/Phi-3-3.8B-IntroPyNUS-web',
  model_id: 'Phi-3-3.8B-IntroPyNUS-web',
  model_lib: webllm.modelLibURLPrefix + webllm.modelVersion + Phi3Wasm,
  vram_required_MB: 2520.07,
  low_resource_required: true,
}

export const configPhiBasic: webllm.ModelRecord = {
  model:
    'https://huggingface.co/machine-teaching-group/Phi-3-3.8B-BasicAlgo-web',
  model_id: 'Phi-3-3.8B-BasicAlgo-web',
  model_lib: webllm.modelLibURLPrefix + webllm.modelVersion + Phi3Wasm,
  vram_required_MB: 2520.07,
  low_resource_required: true,
}
