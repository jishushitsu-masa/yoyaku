/**
 * フロントエンド共通JavaScript
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbyDCVMhbQ4N_j8SXy5QCpaIMtDmMpOwfdYInGcTwZofQomfGqui4iI65KPtShW5J1D5gg/exec';

/**
 * API通信用ラッパー関数
 * GASの制約を回避するため、すべてPOST(text/plain)で送信します
 */
async function apiFetch(action, data = {}) {
  try {
    const payload = {
      action: action,
      ...data
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', message: 'サーバーと通信できませんでした。' };
  }
}

function showLoader(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = '<div class="loader"></div>';
    el.classList.remove('hidden');
  }
}

function hideLoader(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.add('hidden');
    el.innerHTML = '';
  }
}

function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.color = isError ? 'var(--danger)' : 'var(--secondary)';
    el.classList.remove('hidden');
  }
}
