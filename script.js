let audioContext;
let oscillator;
let gainNode;

const frequencyInput = document.getElementById('frequency');
const frequencySlider = document.getElementById('frequency-slider');
const volumeControl = document.getElementById('volume');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const segmentSelector = document.getElementById('segment');
const lowSlider = document.getElementById('low-slider');
const midSlider = document.getElementById('mid-slider');
const highSlider = document.getElementById('high-slider');
const rangeRadios = document.getElementsByName('range');

// スライダーのステップを動的に変更
function updateSliderStep(value) {
    if (value <= 1000) {
        frequencySlider.step = 1; // 低周波数: 1Hz単位
    } else if (value <= 5000) {
        frequencySlider.step = 10; // 中周波数: 10Hz単位
    } else {
        frequencySlider.step = 100; // 高周波数: 100Hz単位
    }
}

// セグメントに応じたスライダーの範囲を設定
segmentSelector.addEventListener('change', () => {
    const segment = segmentSelector.value;
    if (segment === 'low') {
        frequencySlider.min = 10;
        frequencySlider.max = 1000;
        frequencySlider.step = 1;
    } else if (segment === 'mid') {
        frequencySlider.min = 1000;
        frequencySlider.max = 5000;
        frequencySlider.step = 10;
    } else if (segment === 'high') {
        frequencySlider.min = 5000;
        frequencySlider.max = 20000;
        frequencySlider.step = 100;
    }
    // 現在のスライダー値を範囲内にリセット
    frequencySlider.value = frequencySlider.min;
    frequencyInput.value = frequencySlider.min;
});

// 初期セグメントを設定
segmentSelector.dispatchEvent(new Event('change'));

// 周波数スライダーと入力フォームを同期
frequencyInput.addEventListener('input', () => {
    frequencySlider.value = frequencyInput.value;
    updateSliderStep(frequencyInput.value);
    if (oscillator) {
        oscillator.frequency.value = parseFloat(frequencyInput.value);
    }
});

frequencySlider.addEventListener('input', () => {
    frequencyInput.value = frequencySlider.value;
    updateSliderStep(frequencySlider.value);
    if (oscillator) {
        oscillator.frequency.value = parseFloat(frequencySlider.value);
    }
});

// 初期ステップ値を設定
updateSliderStep(frequencySlider.value);

// ラジオボタンの選択に応じてスライダーを有効化/無効化
rangeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'low') {
            lowSlider.disabled = false;
            midSlider.disabled = true;
            highSlider.disabled = true;
            frequencyInput.value = lowSlider.value;
        } else if (radio.value === 'mid') {
            lowSlider.disabled = true;
            midSlider.disabled = false;
            highSlider.disabled = true;
            frequencyInput.value = midSlider.value;
        } else if (radio.value === 'high') {
            lowSlider.disabled = true;
            midSlider.disabled = true;
            highSlider.disabled = false;
            frequencyInput.value = highSlider.value;
        }
    });
});

// スライダーの値を周波数入力に反映
lowSlider.addEventListener('input', () => {
    if (!lowSlider.disabled) {
        frequencyInput.value = lowSlider.value;
        if (oscillator) {
            oscillator.frequency.value = parseFloat(lowSlider.value);
        }
    }
});

midSlider.addEventListener('input', () => {
    if (!midSlider.disabled) {
        frequencyInput.value = midSlider.value;
        if (oscillator) {
            oscillator.frequency.value = parseFloat(midSlider.value);
        }
    }
});

highSlider.addEventListener('input', () => {
    if (!highSlider.disabled) {
        frequencyInput.value = highSlider.value;
        if (oscillator) {
            oscillator.frequency.value = parseFloat(highSlider.value);
        }
    }
});

// 再生ボタンの動作
playButton.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!oscillator) {
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = parseFloat(frequencyInput.value);
        gainNode.gain.value = parseFloat(volumeControl.value);

        oscillator.connect(gainNode).connect(audioContext.destination);
        oscillator.start();
    }

    // 周波数と音量のリアルタイム更新
    volumeControl.addEventListener('input', () => {
        if (gainNode) {
            gainNode.gain.value = parseFloat(volumeControl.value);
        }
    });
});

// 停止ボタンの動作
stopButton.addEventListener('click', () => {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
});