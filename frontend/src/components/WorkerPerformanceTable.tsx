/**
 * Worker Performance Table
 * Shows individual worker scores and hazard detection results
 */

import type { WorkerResult, EnergyBreakdown } from '../types';
import { Pill } from './Pill';

interface WorkerPerformanceTableProps {
  workers: WorkerResult[];
  energyBreakdown: EnergyBreakdown[];
}

export function WorkerPerformanceTable({ workers, energyBreakdown }: WorkerPerformanceTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '12px 8px',
                fontWeight: 600,
                color: '#475569',
                position: 'sticky',
                left: 0,
                background: '#fff',
                zIndex: 1,
              }}
            >
              Worker
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              Score
            </th>
            {energyBreakdown.map((energy) => (
              <th
                key={energy.id}
                style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  fontWeight: 600,
                  color: '#475569',
                  minWidth: 80,
                }}
              >
                <div>{energy.icon}</div>
                <div style={{ fontSize: 10, marginTop: 2, color: '#94a3b8' }}>{energy.label}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workers.map((worker, idx) => (
            <tr
              key={worker.workerId}
              style={{
                borderBottom: '1px solid #f1f5f9',
                background: idx % 2 === 0 ? '#fff' : '#f8fafc',
              }}
            >
              <td
                style={{
                  padding: '10px 8px',
                  fontWeight: 500,
                  color: '#0f172a',
                  position: 'sticky',
                  left: 0,
                  background: idx % 2 === 0 ? '#fff' : '#f8fafc',
                  zIndex: 1,
                }}
              >
                {worker.name}
              </td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                <Pill value={worker.score} />
              </td>
              {energyBreakdown.map((energy) => {
                const hazard = worker.hazards.find((h) => h.energyId === energy.id);
                if (!hazard) {
                  return (
                    <td key={energy.id} style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{ color: '#cbd5e1' }}>—</span>
                    </td>
                  );
                }

                const identified = hazard.identifiedCorrectly;
                const highEnergyCorrect = hazard.correctHighEnergy;
                const directControlCorrect = hazard.correctDirectControl;

                return (
                  <td key={energy.id} style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                      {/* Identification */}
                      <div
                        title={identified ? 'Identified' : 'Missed'}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 3,
                          background: identified ? '#16a34a' : '#dc2626',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {identified ? '✓' : '✗'}
                      </div>
                      {/* High Energy */}
                      {hazard.markedHighEnergy && (
                        <div
                          title={`High Energy: ${highEnergyCorrect ? 'Correct' : 'Incorrect'}`}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            background: highEnergyCorrect ? '#0284c7' : '#f59e0b',
                            fontSize: 9,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          H
                        </div>
                      )}
                      {/* Direct Control */}
                      {hazard.markedDirectControl && (
                        <div
                          title={`Direct Control: ${directControlCorrect ? 'Correct' : 'Incorrect'}`}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            background: directControlCorrect ? '#7c3aed' : '#f59e0b',
                            fontSize: 9,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          D
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Legend</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: '#16a34a',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              ✓
            </div>
            <span>Identified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: '#dc2626',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              ✗
            </div>
            <span>Missed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: '#0284c7',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              H
            </div>
            <span>High Energy (correct)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: '#7c3aed',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              D
            </div>
            <span>Direct Control (correct)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                background: '#f59e0b',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              ?
            </div>
            <span>Incorrect classification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
