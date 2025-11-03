/**
 * 테스트에 사용할 가상의 문제 데이터 배열입니다.
 * 실제 구현 시에는 서버(DB)에서 이 데이터를 가져와야 합니다.
 */
const questions = [
    {
        id: 1,
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        options: ['반갑습니다람쥐', '집에가고싶다', '아니요', '네'],
        correctAnswer: 4, // '네' (value="4"에 해당)
        answerText: '네'
    },
    {
        id: 2,
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        options: ['수고하셨습니다', '학교', '사랑해', '물'],
        correctAnswer: 1, // '수고하셨습니다' (value="1"에 해당)
        answerText: '수고하셨습니다'
    },
    { 
        id: 3, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        options: ['오늘', '내일', '어제', '모레'], 
        correctAnswer: 3, 
        answerText: '어제' 
    },
    { 
        id: 4, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
        options: ['가족', '친구', '선생님', '학생'], 
        correctAnswer: 2, 
        answerText: '친구' 
    },
    { 
        id: 5, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
        options: ['먹다', '마시다', '자다', '뛰다'], 
        correctAnswer: 1, 
        answerText: '먹다' 
    },
    { 
        id: 6, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        options: ['책', '연필', '지우개', '공책'], 
        correctAnswer: 4, 
        answerText: '공책' 
    },
    { 
        id: 7, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
        options: ['좋다', '싫다', '아프다', '슬프다'], 
        correctAnswer: 1, 
        answerText: '좋다' 
    },
    { 
        id: 8, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
        options: ['기차', '자동차', '비행기', '배'], 
        correctAnswer: 2, 
        answerText: '자동차' 
    },
    { 
        id: 9, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 
        options: ['돈', '사랑', '꿈', '행복'], 
        correctAnswer: 4, 
        answerText: '행복' 
    },
    { 
        id: 10, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 
        options: ['집', '학교', '회사', '병원'], 
        correctAnswer: 3, 
        answerText: '회사' 
    },
];

let currentQ_Index = 0; // 현재 문제 번호 (0부터 시작)
let score = 0;               // 맞춘 문제 수

// DOM 요소 초기화 및 메인 함수
function startTest() {
    // 1. 필요한 HTML 요소 가져오기
    const questionVideo = document.getElementById('question_video'); 
    // [수정] '문제 영상 1 / 10' 텍스트를 올바르게 선택
    const questionNumber = document.getElementById('question-subtitle'); 
    const answerForm = document.querySelector('.answer-form');
    const answerLabels = document.querySelectorAll('.answer-list label');

    // 요소가 없으면 실행 중지
    if (!questionVideo || !questionNumber || !answerForm || answerLabels.length === 0) {
        console.error("테스트 실행에 필요한 HTML 요소를 찾을 수 없습니다. HTML 구조를 확인하세요.");
        return;
    }

    // 2. 초기 문제 로드
    Firt_Question(currentQ_Index, questionVideo, questionNumber, answerLabels);

    // 3. 정답 제출 이벤트 리스너 연결
    answerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // 폼 기본 제출 방지
        submitAnswer(event, questionVideo, questionNumber, answerLabels);
    });
}

/**
 * 특정 인덱스의 문제를 화면에 표시합니다.
 */
function Firt_Question(index, videoElement, displayElement, labelElements) {
    if (index >= questions.length) {
        console.log(`테스트 종료. 최종 점수: ${score}.`);
       // [수정] alert 대신 console.log로 변경하고, 결과 페이지로 이동 (예시)
       // 실제 결과 페이지 URL로 변경하세요.
       alert(`테스트가 종료되었습니다. 최종 점수: ${score} / ${questions.length}`);
       window.location.href = window.APP_CTX || '/'; // 메인 페이지로 이동 (APP_CTX는 JSP에서 설정)
        return;
    }

    const question = questions[index];

    // 1. 문제 번호 업데이트
    displayElement.textContent = `문제 영상 ${index + 1} / ${questions.length}`;

    // 2. 영상 로드 및 재생
    fetchVideo(videoElement, question.videoUrl);

    // 3. 선택지 업데이트
    labelElements.forEach((label, i) => {
        const optionText = question.options[i];
        if (optionText) {
            label.textContent = optionText;
            label.htmlFor = `ans${i + 1}`;
            
            const inputElement = label.previousElementSibling;
            if (inputElement) {
                inputElement.value = `${i + 1}`;
                inputElement.checked = false; // 선택 초기화
            }
        } else {
            label.textContent = ''; // 선택지가 부족할 경우 빈칸
            // [수정] 선택지가 없는 경우 라디오 버튼과 라벨을 숨깁니다.
            label.style.display = 'none';
            if (label.previousElementSibling) {
                label.previousElementSibling.style.display = 'none';
            }
        }
    });
}

// 영상 로드 함수
function fetchVideo(videoElement, videoURL) {
    if (!videoElement) return;

    videoElement.src = videoURL;
    videoElement.load();
    videoElement.muted = false; 
    videoElement.controls = true; 

    const playPromise = videoElement.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log(`[테스트] 문제 영상 재생 시작: ${videoURL}`);
            })  
            .catch((error) => {
                // 자동 재생이 실패하면 비디오 컨트롤이 보이므로 사용자가 직접 누를 수 있습니다.
                console.warn(`[테스트] 영상 자동 재생 실패. 사용자의 상호작용이 필요할 수 있습니다. (오류: ${error.name})`);
            });
    }
}

// 정답 제출 함수
function submitAnswer(event, videoElement, displayElement, labelElements) {
    const selectedRadio = event.target.querySelector('input[name="answer"]:checked');

    if (!selectedRadio) {        
        alert('정답을 선택해주세요.'); 
        return;
    }

    const selectedAnswerValue = parseInt(selectedRadio.value, 10);
    const question = questions[currentQ_Index];
    
    // [수정] alert 대신 좀 더 부드러운 피드백 (예: 모달)을 사용하는 것이 좋지만,
    // 일단 alert을 유지하되, 정답/오답 피드백을 개선합니다.
    // 정답 확인
    if (selectedAnswerValue === question.correctAnswer) {
        score++;        
        alert(`정답입니다! (현재 ${score}점)`); 
    } else {       
        alert(`오답입니다. 정답은 "${question.answerText}" 입니다.`); 
    }
    
    // 다음 문제로 이동
    currentQ_Index++;

    // [수정] 비디오 정지
    videoElement.pause();
    videoElement.src = ""; // 다음 문제 로드 전 소스 비우기

    // 다음 문제 로드 (딜레이를 짧게 줄이거나 없애도 됩니다)
    setTimeout(() => {
        Firt_Question(currentQ_Index, videoElement, displayElement, labelElements);
    }, 500); // 0.5초 후 다음 문제 로드
}


// 메인 이벤트 리스너 (HTML 로드 후 실행)
document.addEventListener('DOMContentLoaded', startTest);
