'use client';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: string;
}

export function Card({ title, value, subtitle, icon, trend, color = 'from-primary to-accent' }: CardProps) {
  return (
    <div className="card-glass">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
