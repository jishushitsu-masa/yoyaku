/**
 * フロントエンド共通JavaScript
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbwAlTZMmZyyuV7D8fpsXG9v7wCJRVRH4cvwi5jX577CAL4QDGFgFRmPdoTBON5Ivk8/exec';

/**
 * API通信用ラッパー関数
 * GASの制約を回避するため、すべてPOST(text/plain)で送信します
 */
async function apiFetch(action, data = {}, retries = null) {
  // 読み取り系はデフォルト3回リトライ、書き込み系（予約など）は二重実行防止のためリトライしない
  if (retries === null) {
    const readActions = ['getSchedule', 'getAdminData', 'getReservationDetail', 'getUserReservations', 'login'];
    retries = readActions.includes(action) ? 3 : 0;
  }

  const payload = {
    action: action,
    ...data
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`API Error (attempt ${attempt + 1}):`, error);
      if (attempt === retries) {
        return { status: 'error', message: 'サーバーと通信できませんでした。しばらく時間をおいてから再度お試しください。' };
      }
      // リトライ間隔: 1秒, 2秒, 3秒...
      await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
    }
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