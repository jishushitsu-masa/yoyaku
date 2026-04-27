/**
 * フロントエンド共通JavaScript
 * 
 * 注意: 以下の API_URL を、GASの「ウェブアプリ」としてデプロイした際のURLに書き換えてください。
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbyDCVMhbQ4N_j8SXy5QCpaIMtDmMpOwfdYInGcTwZofQomfGqui4iI65KPtShW5J1D5gg/exec'; // ←ここにGASのURLを貼り付け

/**
 * API通信用ラッパー関数
 */
async function apiFetch(action, data = null) {
  try {
    if (data) {
      // POSTリクエスト
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // GASのCORS制約回避のためtext/plainを使用
        },
        body: JSON.stringify({ action: action, ...data })
      });
      return await response.json();
    } else {
      // GETリクエスト
      const response = await fetch(`${API_URL}?action=${action}`);
      return await response.json();
    }
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', message: '通信エラーが発生しました。' };
  }
}

/**
 * UI制御: ローダーの表示/非表示
 */
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
  }
}

/**
 * メッセージ表示用ユーティリティ
 */
function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.color = isError ? 'var(--danger)' : 'var(--secondary)';
    el.style.fontWeight = 'bold';
    el.style.marginTop = '1rem';
    el.style.textAlign = 'center';
    el.classList.remove('hidden');
  }
}

/**
 * 日付フォーマット (yyyy/MM/dd)
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
}

/**
 * URLパラメータ取得
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
