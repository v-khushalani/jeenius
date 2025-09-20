import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sword, Shield, Trophy, Target, Zap, Clock, Users, Star, Crown, 
  Flame, Bolt, Skull, Award, Medal, Swords, Timer, CheckCircle,
  X, Play, Pause, RotateCcw, ArrowRight, User, BookOpen, Brain,
  TrendingUp, Activity, Gamepad2, Search, UserCheck, Loader2
} from 'lucide-react';

const PeerBattleSystem = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('lobby'); // lobby, matchmaking, battle, result
  const [playerStats, setPlayerStats] = useState({
    level: 3,
    rank: 'Silver Warrior',
    points: 12450,
    winRate: 72,
    battlesWon: 24,
    battlesPlayed: 33,
    currentStreak: 5,
    bestStreak: 8,
    badges: ['speed_demon', 'accuracy_ace', 'streak_master']
  });
  
  const [battleState, setBattleState] = useState({
    opponent: null,
    currentQuestion: null,
    questionNumber: 0,
    playerScore: 0,
    opponentScore: 0,
    timeRemaining: 30,
    playerAnswer: null,
    opponentAnswer: null,
    isAnswered: false,
    battleEnded: false
  });

  const [matchmaking, setMatchmaking] = useState({
    isSearching: false,
    searchTime: 0,
    foundOpponent: false
  });

  // Battle Questions Database
  const battleQuestions = [
    {
      id: 1,
      question: "A ball is thrown upward with velocity 20 m/s. Time to reach maximum height? (g = 10 m/s²)",
      options: ["1 s", "2 s", "3 s", "4 s"],
      correct: 1,
      difficulty: "medium",
      points: 100
    },
    {
      id: 2,
      question: "What is the atomic number of Carbon?",
      options: ["4", "6", "8", "12"],
      correct: 1,
      difficulty: "easy",
      points: 75
    },
    {
      id: 3,
      question: "Solve: x² - 5x + 6 = 0",
      options: ["x = 2, 3", "x = 1, 4", "x = -2, -3", "x = 0, 5"],
      correct: 0,
      difficulty: "medium",
      points: 125
    }
  ];

  // Warrior Badges System
  const warriorBadges = {
    speed_demon: {
      name: "Speed Demon",
      icon: Zap,
      color: "bg-yellow-500",
      description: "Answer 5 questions in under 10 seconds each",
      rarity: "rare"
    },
    accuracy_ace: {
      name: "Accuracy Ace", 
      icon: Target,
      color: "bg-green-500",
      description: "Maintain 90%+ accuracy in battles",
      rarity: "epic"
    },
    streak_master: {
      name: "Streak Master",
      icon: Flame,
      color: "bg-red-500", 
      description: "Win 5 battles in a row",
      rarity: "legendary"
    },
    giant_slayer: {
      name: "Giant Slayer",
      icon: Skull,
      color: "bg-purple-500",
      description: "Defeat opponents 2 levels higher",
      rarity: "mythic"
    },
    lightning_reflexes: {
      name: "Lightning Reflexes",
      icon: Zap,
      color: "bg-blue-500",
      description: "Answer correctly within 3 seconds",
      rarity: "rare"
    },
    battle_tested: {
      name: "Battle Tested",
      icon: Shield,
      color: "bg-gray-600",
      description: "Complete 50 battles",
      rarity: "common"
    },
    unstoppable: {
      name: "Unstoppable Force",
      icon: Crown,
      color: "bg-orange-500",
      description: "10 win streak achievement",
      rarity: "legendary"
    }
  };

  // Rank System
  const rankSystem = {
    1: { name: "Bronze Warrior", color: "#CD7F32", minPoints: 0 },
    2: { name: "Silver Warrior", color: "#C0C0C0", minPoints: 5000 },
    3: { name: "Gold Gladiator", color: "#FFD700", minPoints: 15000 },
    4: { name: "Platinum Champion", color: "#E5E4E2", minPoints: 30000 },
    5: { name: "Diamond Legend", color: "#B9F2FF", minPoints: 50000 },
    6: { name: "Master Warrior", color: "#FF6347", minPoints: 75000 },
    7: { name: "Grand Master", color: "#8A2BE2", minPoints: 100000 }
  };

  // Timer for battle countdown
  useEffect(() => {
    let timer;
    if (currentView === 'battle' && battleState.timeRemaining > 0 && !battleState.isAnswered) {
      timer = setInterval(() => {
        setBattleState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    }

    if (battleState.timeRemaining === 0 && !battleState.isAnswered) {
      handleTimeOut();
    }

    return () => clearInterval(timer);
  }, [battleState.timeRemaining, battleState.isAnswered, currentView]);

  // Matchmaking timer
  useEffect(() => {
    let timer;
    if (matchmaking.isSearching) {
      timer = setInterval(() => {
        setMatchmaking(prev => ({
          ...prev,
          searchTime: prev.searchTime + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [matchmaking.isSearching]);

  // Start matchmaking
  const startMatchmaking = () => {
    setMatchmaking({
      isSearching: true,
      searchTime: 0,
      foundOpponent: false
    });
    setCurrentView('matchmaking');
    
    // Simulate finding opponent after 3-8 seconds
    setTimeout(() => {
      const mockOpponent = {
        name: "Anonymous_" + Math.floor(Math.random() * 1000),
        level: playerStats.level + Math.floor(Math.random() * 3) - 1, // ±1 level
        rank: rankSystem[Math.min(Math.max(1, playerStats.level + Math.floor(Math.random() * 3) - 1), 7)].name,
        points: playerStats.points + Math.floor(Math.random() * 4000) - 2000,
        winRate: Math.floor(Math.random() * 40) + 50,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      };
      
      setMatchmaking(prev => ({ ...prev, foundOpponent: true }));
      setBattleState(prev => ({ 
        ...prev, 
        opponent: mockOpponent,
        currentQuestion: battleQuestions[0],
        questionNumber: 1,
        timeRemaining: 30
      }));
      
      setTimeout(() => {
        setCurrentView('battle');
      }, 2000);
    }, Math.random() * 5000 + 3000);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (battleState.isAnswered || battleState.timeRemaining === 0) return;
    
    setBattleState(prev => ({
      ...prev,
      playerAnswer: answerIndex,
      isAnswered: true
    }));

    // Simulate opponent answer with slight delay
    setTimeout(() => {
      const opponentAnswer = Math.random() < 0.7 ? battleState.currentQuestion.correct : Math.floor(Math.random() * 4);
      setBattleState(prev => ({
        ...prev,
        opponentAnswer: opponentAnswer
      }));
      
      // Calculate scores
      setTimeout(() => {
        const playerCorrect = answerIndex === battleState.currentQuestion.correct;
        const opponentCorrect = opponentAnswer === battleState.currentQuestion.correct;
        const timeBonus = Math.max(0, battleState.timeRemaining * 2);
        
        setBattleState(prev => ({
          ...prev,
          playerScore: prev.playerScore + (playerCorrect ? battleState.currentQuestion.points + timeBonus : 0),
          opponentScore: prev.opponentScore + (opponentCorrect ? battleState.currentQuestion.points + Math.floor(Math.random() * 20) : 0)
        }));

        // Next question or end battle
        setTimeout(() => {
          if (battleState.questionNumber >= 5) {
            endBattle();
          } else {
            nextQuestion();
          }
        }, 3000);
      }, 1500);
    }, Math.random() * 2000 + 1000);
  };

  const handleTimeOut = () => {
    setBattleState(prev => ({
      ...prev,
      playerAnswer: -1,
      isAnswered: true
    }));
  };

  const nextQuestion = () => {
    const nextQ = battleQuestions[battleState.questionNumber];
    setBattleState(prev => ({
      ...prev,
      currentQuestion: nextQ,
      questionNumber: prev.questionNumber + 1,
      timeRemaining: 30,
      playerAnswer: null,
      opponentAnswer: null,
      isAnswered: false
    }));
  };

  const endBattle = () => {
    setBattleState(prev => ({ ...prev, battleEnded: true }));
    setCurrentView('result');
  };

  const cancelMatchmaking = () => {
    setMatchmaking({
      isSearching: false,
      searchTime: 0,
      foundOpponent: false
    });
    setCurrentView('lobby');
  };

  const returnToLobby = () => {
    setCurrentView('lobby');
    setBattleState({
      opponent: null,
      currentQuestion: null,
      questionNumber: 0,
      playerScore: 0,
      opponentScore: 0,
      timeRemaining: 30,
      playerAnswer: null,
      opponentAnswer: null,
      isAnswered: false,
      battleEnded: false
    });
    setMatchmaking({
      isSearching: false,
      searchTime: 0,
      foundOpponent: false
    });
  };

  // Battle Lobby View
  if (currentView === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              ⚔️ Battle Arena ⚔️
            </h1>
            <p className="text-xl text-gray-300">Face warriors of your level in epic knowledge battles!</p>
          </div>

          {/* Player Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-2 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-4">
                      <Crown className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Your Warrior Profile</h3>
                      <p className="text-gray-400">Level {playerStats.level} • {playerStats.rank}</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {playerStats.points.toLocaleString()} BP
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{playerStats.winRate}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{playerStats.battlesWon}</div>
                    <div className="text-sm text-gray-400">Victories</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{playerStats.currentStreak}</div>
                    <div className="text-sm text-gray-400">Streak</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{playerStats.battlesPlayed}</div>
                    <div className="text-sm text-gray-400">Total Battles</div>
                  </div>
                </div>

                {/* Warrior Badges */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Warrior Badges
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {playerStats.badges.map((badgeId) => {
                      const badge = warriorBadges[badgeId];
                      const IconComponent = badge.icon;
                      return (
                        <div 
                          key={badgeId}
                          className={`p-2 rounded-lg ${badge.color} bg-opacity-20 border border-current flex items-center cursor-pointer group relative`}
                        >
                          <IconComponent className={`w-5 h-5 ${badge.color.replace('bg-', 'text-')}`} />
                          <span className="ml-2 text-sm font-medium">{badge.name}</span>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {badge.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battle Actions */}
            <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white">
              <CardHeader>
                <CardTitle className="text-center">
                  <Swords className="w-8 h-8 mx-auto mb-2" />
                  Ready for Battle?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={startMatchmaking}
                  className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold py-3 text-lg"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Opponent
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm opacity-90">
                    You'll face Level {Math.max(1, playerStats.level - 1)} - {Math.min(7, playerStats.level + 1)} warriors
                  </p>
                  <p className="text-xs opacity-75">
                    5 questions • 30 seconds each • Winner takes points!
                  </p>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="font-semibold mb-2">Battle Rewards:</h4>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• +100-300 Battle Points (BP)</li>
                    <li>• Warrior Badges</li>
                    <li>• Rank Progression</li>
                    <li>• Glory & Bragging Rights!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                Battle Leaderboard (Your Rank: #127)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Lightning_Master", level: 7, points: 15420, streak: 12 },
                  { rank: 2, name: "Math_Destroyer", level: 6, points: 14890, streak: 8 },
                  { rank: 3, name: "Physics_Wizard", level: 6, points: 14560, streak: 15 },
                  { rank: 4, name: "Chem_Warrior", level: 5, points: 13940, streak: 3 },
                  { rank: 5, name: "Battle_Born", level: 5, points: 13730, streak: 7 }
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        player.rank === 1 ? 'bg-yellow-500' : player.rank === 2 ? 'bg-gray-400' : player.rank === 3 ? 'bg-orange-500' : 'bg-gray-600'
                      }`}>
                        {player.rank <= 3 ? <Crown className="w-4 h-4" /> : player.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-400">Level {player.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{player.points.toLocaleString()} BP</div>
                      <div className="text-sm text-gray-400 flex items-center">
                        <Flame className="w-3 h-3 mr-1" />
                        {player.streak} streak
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Matchmaking View
  if (currentView === 'matchmaking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            {!matchmaking.foundOpponent ? (
              <>
                <div className="mb-6">
                  <Loader2 className="w-16 h-16 mx-auto text-orange-500 animate-spin mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Finding Your Opponent...</h2>
                  <p className="text-gray-400">Searching for Level {playerStats.level} warriors</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-mono text-orange-500">
                    {Math.floor(matchmaking.searchTime / 60)}:{(matchmaking.searchTime % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Average wait time: 30-60 seconds</p>
                </div>

                <Button 
                  onClick={cancelMatchmaking}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel Search
                </Button>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <UserCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-green-500">Opponent Found!</h2>
                  <p className="text-gray-400">Preparing battle arena...</p>
                </div>

                {battleState.opponent && (
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-4">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold">{battleState.opponent.name}</div>
                        <div className="text-sm text-gray-400">
                          Level {battleState.opponent.level} • {battleState.opponent.rank}
                        </div>
                        <div className="text-sm text-gray-400">
                          {battleState.opponent.winRate}% win rate
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-400">
                  Battle starts in 3 seconds...
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Battle View
  if (currentView === 'battle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
        <div className="container mx-auto max-w-4xl">
          {/* Battle Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">YOU</div>
              <div className="text-2xl font-bold text-blue-400">{battleState.playerScore}</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {battleState.timeRemaining}
              </div>
              <div className="text-sm text-gray-400">
                Question {battleState.questionNumber}/5
              </div>
              <Progress 
                value={(battleState.timeRemaining / 30) * 100} 
                className="w-32 h-2 mt-2"
              />
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-white">OPPONENT</div>
              <div className="text-2xl font-bold text-red-400">{battleState.opponentScore}</div>
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6 bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {battleState.currentQuestion?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {battleState.currentQuestion?.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={battleState.isAnswered}
                    className={`p-4 h-auto text-left justify-start ${
                      battleState.isAnswered
                        ? index === battleState.currentQuestion.correct
                          ? 'bg-green-600 hover:bg-green-600'
                          : battleState.playerAnswer === index
                          ? 'bg-red-600 hover:bg-red-600'
                          : 'bg-gray-700 hover:bg-gray-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </Button>
                ))}
              </div>

              {battleState.isAnswered && (
                <div className="mt-6 text-center">
                  <div className="flex justify-around text-sm">
                    <div className={`p-3 rounded ${
                      battleState.playerAnswer === battleState.currentQuestion?.correct ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      You: {battleState.playerAnswer === battleState.currentQuestion?.correct ? '✓ Correct' : '✗ Wrong'}
                    </div>
                    <div className={`p-3 rounded ${
                      battleState.opponentAnswer === battleState.currentQuestion?.correct ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      Opponent: {battleState.opponentAnswer !== null ? 
                        (battleState.opponentAnswer === battleState.currentQuestion?.correct ? '✓ Correct' : '✗ Wrong')
                        : '⏳ Thinking...'
                      }
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Battle Result View
  if (currentView === 'result') {
    const playerWon = battleState.playerScore > battleState.opponentScore;
    const tie = battleState.playerScore === battleState.opponentScore;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {playerWon ? (
                <>
                  <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
                  <h2 className="text-4xl font-bold text-yellow-500 mb-2">VICTORY! 🎉</h2>
                  <p className="text-xl text-green-400">You are the champion!</p>
                </>
              ) : tie ? (
                <>
                  <Swords className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-4xl font-bold text-gray-400 mb-2">DRAW! 🤝</h2>
                  <p className="text-xl text-yellow-400">Equally matched warriors!</p>
                </>
              ) : (
                <>
                  <Skull className="w-20 h-20 mx-auto text-red-500 mb-4" />
                  <h2 className="text-4xl font-bold text-red-500 mb-2">DEFEAT 💔</h2>
                  <p className="text-xl text-red-400">Better luck next time!</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">YOUR SCORE</div>
                <div className="text-3xl font-bold text-blue-400">{battleState.playerScore}</div>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">OPPONENT SCORE</div>
                <div className="text-3xl font-bold text-red-400">{battleState.opponentScore}</div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-3">Battle Rewards:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Battle Points:</span>
                  <span className="text-yellow-500">+{playerWon ? 150 : tie ? 75 : 25} BP</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="text-blue-500">+{playerWon ? 50 : tie ? 25 : 10} XP</span>
                </div>
                {playerWon && (
                  <div className="flex justify-between">
                    <span>Win Streak Bonus:</span>
                    <span className="text-green-500">+{playerStats.currentStreak * 10} BP</span>
                  </div>
                )}
                {playerWon && Math.random() < 0.3 && (
                  <div className="flex justify-between">
                    <span>🏆 New Badge Unlocked!</span>
                    <span className="text-purple-500">Battle Tested</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={startMatchmaking}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                size="lg"
              >
                <Swords className="w-5 h-5 mr-2" />
                Battle Again
              </Button>
              
              <Button 
                onClick={returnToLobby}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Return to Lobby
              </Button>
            </div>

            {/* Performance Breakdown */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <h4 className="font-semibold mb-4">Battle Analysis:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {Math.floor(Math.random() * 3) + 2}/5
                  </div>
                  <div className="text-gray-400">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {Math.floor(Math.random() * 10) + 15}s
                  </div>
                  <div className="text-gray-400">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">
                    {Math.floor(Math.random() * 30) + 60}%
                  </div>
                  <div className="text-gray-400">Speed Bonus</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default PeerBattleSystem;
