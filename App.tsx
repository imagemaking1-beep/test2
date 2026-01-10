
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, RotateCcw, Check, X, Trophy, 
  Clapperboard, HelpCircle, ArrowRight, 
  Sparkles, Zap, Film, Flame, Ghost 
} from 'lucide-react';
import { GameState, QuizQuestion, QuizTheme } from './types';
import { generateQuizzesByTheme } from './services/geminiService';
import { NeoButton, NeoCard, NeoBadge } from './components/UI';

const THEMES: QuizTheme[] = [
  { id: 'hollywood', name: '할리우드 대작', icon: '🎬', description: '전 세계가 사랑한 블록버스터' },
  { id: 'korean', name: '한국 영화', icon: '🇰🇷', description: '천만 관객 신화의 주인공들' },
  { id: 'animation', name: '디즈니 & 애니', icon: '🐭', description: '꿈과 희망의 애니메이션' },
  { id: 'horror', name: '공포 & 스릴러', icon: '👻', description: '잠 못 이루게 만든 공포물' },
  { id: 'classic', name: '추억의 명작', icon: '🎞️', description: '다시 봐도 감동적인 클래식' },
];

const FALLBACK_QUIZ: QuizQuestion[] = [
  { emojis: "❄️👸☃️", answer: "겨울왕국", aliases: ["프로즌", "frozen"], hint: "렛 잇 고~" },
  { emojis: "🦁👑", answer: "라이온 킹", aliases: ["라이언킹"], hint: "동물들의 왕" },
  { emojis: "🕷️🕸️👨", answer: "스파이더맨", aliases: ["스파이더 맨"], hint: "거미줄을 쏘는 히어로" },
  { emojis: "🚢🧊💑", answer: "타이타닉", aliases: ["titanic"], hint: "침몰하는 배와 슬픈 사랑" },
  { emojis: "🐼👊🥋", answer: "쿵푸팬더", aliases: ["쿵후팬더"], hint: "무술하는 판다" },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('AI가 퀴즈를 생성하고 있습니다...');

  const handleStart = () => setGameState(GameState.SELECT_THEME);

  const loadQuizzes = async (theme: QuizTheme) => {
    setGameState(GameState.LOADING);
    setLoadingMessage(`"${theme.name}" 테마의 퀴즈를 가져오는 중...`);
    
    try {
      const generated = await generateQuizzesByTheme(theme.name);
      setQuestions(generated);
      setGameState(GameState.PLAYING);
    } catch (error) {
      console.error("AI Generation failed, using fallback", error);
      setQuestions(FALLBACK_QUIZ);
      setGameState(GameState.PLAYING);
    }
    
    setCurrentIndex(0);
    setScore(0);
    setUserInput('');
    setShowResult(false);
    setShowHint(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || showResult) return;

    const current = questions[currentIndex];
    const cleanInput = userInput.replace(/\s+/g, '').toLowerCase();
    const possibleAnswers = [current.answer, ...current.aliases].map(a => a.replace(/\s+/g, '').toLowerCase());

    const correct = possibleAnswers.includes(cleanInput);
    setIsCorrect(correct);
    if (correct) setScore(s => s + 10);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameState(GameState.END);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-lg">
        {/* START SCREEN */}
        {gameState === GameState.START && (
          <NeoCard className="p-8 flex flex-col items-center text-center gap-8">
            <div className="bg-[#FFF200] p-6 border-4 border-black rounded-full neo-shadow-sm transform rotate-3 hover:rotate-6 transition-transform">
              <Film size={64} />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter bg-black text-white px-4 py-2 transform -rotate-2">
                EMOJI MOVIE
              </h1>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter bg-[#FFF200] border-4 border-black px-4 py-2 transform rotate-1">
                MASTER AI
              </h1>
            </div>
            <p className="text-xl font-bold bg-white border-2 border-black p-4 neo-shadow-sm transform -rotate-1">
              AI가 즉석에서 생성하는<br/>영화 이모지 퀴즈에 도전하세요!
            </p>
            <NeoButton onClick={handleStart} className="bg-[#FF5252] text-white w-full">
              <Play size={24} fill="currentColor" /> 게임 시작
            </NeoButton>
          </NeoCard>
        )}

        {/* THEME SELECTION */}
        {gameState === GameState.SELECT_THEME && (
          <NeoCard className="p-6">
            <h2 className="text-3xl font-black mb-6 uppercase italic text-center underline decoration-4 decoration-[#FF90E8]">테마 선택하기</h2>
            <div className="grid gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => loadQuizzes(theme)}
                  className="group relative bg-white border-4 border-black p-4 text-left hover:bg-[#FFF200] transition-colors neo-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl group-hover:scale-125 transition-transform">{theme.icon}</span>
                    <div>
                      <h3 className="text-xl font-black">{theme.name}</h3>
                      <p className="text-sm font-bold opacity-70">{theme.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </NeoCard>
        )}

        {/* LOADING SCREEN */}
        {gameState === GameState.LOADING && (
          <NeoCard className="p-12 flex flex-col items-center text-center gap-8">
            <div className="animate-spin text-[#23A094]">
              <Zap size={64} fill="currentColor" />
            </div>
            <p className="text-2xl font-black uppercase tracking-widest animate-pulse">
              {loadingMessage}
            </p>
            <div className="w-full bg-gray-200 border-2 border-black h-4">
              <div className="bg-[#FFF200] h-full animate-[loading_2s_infinite]" style={{width: '30%'}} />
            </div>
            <style>{`
              @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
          </NeoCard>
        )}

        {/* PLAYING SCREEN */}
        {gameState === GameState.PLAYING && currentQ && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <NeoBadge className="bg-black text-white">Q {currentIndex + 1} / {questions.length}</NeoBadge>
              <NeoBadge className="bg-[#FFF200] flex items-center gap-2"><Trophy size={16} /> {score}</NeoBadge>
            </div>

            <NeoCard className="p-10 flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="text-8xl mb-8 transform hover:scale-110 transition-transform select-none drop-shadow-lg">
                {currentQ.emojis}
              </div>
              
              {!showResult && (
                <button 
                  onClick={() => setShowHint(true)}
                  className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-black transition-all ${showHint ? 'bg-[#FFF200]' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <HelpCircle size={18} />
                  {showHint ? currentQ.hint : "HINT"}
                </button>
              )}
            </NeoCard>

            <div className="relative">
              {!showResult ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    autoFocus
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="영화 제목을 입력하세요..."
                    className="w-full p-5 text-xl font-black border-4 border-black neo-shadow-sm focus:outline-none focus:bg-[#FFF200] placeholder:text-gray-400"
                  />
                  <NeoButton type="submit" className="bg-black text-white hover:bg-gray-800">
                    <Check /> 정답 확인
                  </NeoButton>
                </form>
              ) : (
                <div className={`p-6 border-4 border-black neo-shadow flex flex-col items-center gap-4 animate-[slideIn_0.3s_ease-out] ${isCorrect ? 'bg-[#90EE90]' : 'bg-[#FF5252]'}`}>
                  <div className="flex items-center gap-2">
                    {isCorrect ? <Check size={40} strokeWidth={4} /> : <X size={40} strokeWidth={4} />}
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                      {isCorrect ? 'EXCELLENT!' : 'WRONG!'}
                    </h2>
                  </div>
                  
                  {!isCorrect && (
                    <div className="bg-white border-2 border-black p-3 font-black text-lg transform rotate-1">
                      정답: "{currentQ.answer}"
                    </div>
                  )}

                  <NeoButton 
                    onClick={nextQuestion} 
                    className="bg-white text-black w-full"
                  >
                    {currentIndex < questions.length - 1 ? '다음 문제로' : '결과 보기'} <ArrowRight />
                  </NeoButton>
                </div>
              )}
            </div>
          </div>
        )}

        {/* END SCREEN */}
        {gameState === GameState.END && (
          <NeoCard className="p-8 text-center flex flex-col items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
              <div className="relative bg-[#FFF200] p-6 border-4 border-black">
                <Trophy size={80} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl font-black italic">CONGRATS!</h2>
              <p className="font-bold text-xl uppercase tracking-widest opacity-70 underline decoration-2">퀴즈를 모두 마쳤습니다</p>
            </div>

            <div className="bg-white w-full p-6 border-4 border-black neo-shadow-sm transform -rotate-1">
              <span className="bg-black text-white px-3 py-1 text-sm font-black uppercase mb-2 inline-block">Final Score</span>
              <div className="text-7xl font-black">{score}</div>
              <div className="mt-4 pt-4 border-t-2 border-black flex justify-around font-black">
                <div>{questions.length} 문제</div>
                <div>{score / 10} 정답</div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <NeoButton onClick={handleStart} className="bg-[#90EE90] text-black">
                <RotateCcw /> 다른 테마 도전
              </NeoButton>
              <NeoButton onClick={() => setGameState(GameState.START)} className="bg-white text-black border-2">
                처음으로
              </NeoButton>
            </div>
          </NeoCard>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
