import { useDailyPredictions } from '@/hooks/use-predictions';
import { TrendingUp, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { DailyPrediction } from '@/api/predictions-api';
import { useState } from 'react';

export default function DailyPredictions() {
  const { predictions, loading, error, lastUpdated } = useDailyPredictions();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');

  const filtered = predictions.filter((pred) => {
    if (filter === 'high') return pred.prediction.confidence === 'high';
    if (filter === 'medium') return pred.prediction.confidence === 'medium';
    return true;
  });

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-center gap-3">
          <Loader className="w-5 h-5 animate-spin text-orange-500" />
          <p className="text-gray-400">Loading daily predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-red-400 font-semibold">Error loading predictions</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            Daily Predictions
          </h2>
          {lastUpdated && (
            <p className="text-gray-400 text-sm mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm font-medium transition">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Predictions
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'high'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          High Confidence
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'medium'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Medium Confidence
        </button>
      </div>

      {/* Predictions Grid */}
      {filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">No predictions available for selected filter</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((pred) => (
            <PredictionCard key={pred.matchId} prediction={pred} />
          ))}
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Tip:</strong> These predictions are AI-generated based on historical data and current form.
          Use them as one factor among many when making betting decisions.
        </p>
      </div>
    </div>
  );
}

function PredictionCard({ prediction }: { prediction: DailyPrediction }) {
  const { prediction: pred } = prediction;
  const confidence = pred.confidence;
  const bestOdds = Math.max(pred.homeWin, pred.draw, pred.awayWin);

  const confidenceColor: Record<string, string> = {
    high: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const recommendationColor: Record<string, string> = {
    home: 'text-purple-400',
    draw: 'text-blue-400',
    away: 'text-pink-400',
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-orange-500/50 transition">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Match Info */}
        <div>
          <p className="text-gray-400 text-xs uppercase mb-1">{prediction.league}</p>
          <p className="text-white font-semibold text-sm">
            {prediction.homeTeam} vs {prediction.awayTeam}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {new Date(prediction.matchTime).toLocaleDateString()}
          </p>
        </div>

        {/* Prediction Odds */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-xs">Home</p>
              <p
                className={`text-sm font-bold ${
                  pred.recommendation === 'home' ? 'text-purple-400' : 'text-white'
                }`}
              >
                {pred.homeWin}%
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-xs">Draw</p>
              <p
                className={`text-sm font-bold ${
                  pred.recommendation === 'draw' ? 'text-blue-400' : 'text-white'
                }`}
              >
                {pred.draw}%
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-xs">Away</p>
              <p
                className={`text-sm font-bold ${
                  pred.recommendation === 'away' ? 'text-pink-400' : 'text-white'
                }`}
              >
                {pred.awayWin}%
              </p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">BEST PICK</p>
          <p className={`text-lg font-bold capitalize ${recommendationColor[pred.recommendation]}`}>
            {pred.recommendation === 'home'
              ? prediction.homeTeam.split(' ')[0]
              : pred.recommendation === 'away'
                ? prediction.awayTeam.split(' ')[0]
                : 'Draw'}
          </p>
        </div>

        {/* Confidence */}
        <div className={`border rounded-lg p-3 text-center ${confidenceColor[confidence]}`}>
          <p className="text-xs uppercase font-bold mb-1">{confidence} Confidence</p>
          <p className="text-lg font-bold">{bestOdds}%</p>
        </div>

        {/* Model Info */}
        <div className="text-right">
          <p className="text-gray-400 text-xs mb-1">Model Accuracy</p>
          <p className="text-white font-bold">{(prediction.accuracy * 100).toFixed(1)}%</p>
          <p className="text-gray-500 text-xs mt-2">{prediction.model}</p>
        </div>
      </div>
    </div>
  );
}
