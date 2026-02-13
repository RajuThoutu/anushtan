import { TrendingUp, Users } from 'lucide-react';

interface PredictionCardProps {
    confirmed: number;
    predicted: number;
    confidence: number; // 0-100
}

export function PredictionCard({ confirmed, predicted, confidence }: PredictionCardProps) {
    const totalPredicted = confirmed + predicted;

    return (
        <div className="bg-gradient-to-br from-admin-electric-blue to-admin-electric-blue-dark rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-90">
                    <TrendingUp size={20} />
                    <h3 className="font-semibold text-lg">Enrollment Forecast</h3>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-heading font-bold">{Math.round(totalPredicted)}</span>
                    <span className="text-lg opacity-80">students</span>
                </div>

                <div className="text-sm opacity-90 mb-6">
                    Predicted Total for Upcoming Intake
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div>
                        <div className="text-2xl font-bold">{confirmed}</div>
                        <div className="text-xs opacity-80">Confirmed</div>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                        <div className="text-2xl font-bold flex items-center gap-1">
                            +{Math.round(predicted)}
                            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Est.</span>
                        </div>
                        <div className="text-xs opacity-80">Pipeline Conversion</div>
                    </div>
                </div>

                {/* Confidence Meter (Visual) */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-xs opacity-80 mb-1">
                        <span>Prediction Confidence</span>
                        <span>{confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${confidence}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
