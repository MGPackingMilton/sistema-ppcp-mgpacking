// Utilitários para cálculos do sistema PPCP

import { Product, BOMItem, Process, ProductionOrder, KPI, OperationalRates } from './types';

/**
 * Calcula o volume total de madeira em m³ para um produto
 */
export function calculateWoodVolume(bom: BOMItem[]): number {
  return bom
    .filter(item => item.materialType === 'madeira')
    .reduce((total, item) => {
      // Converte mm³ para m³ e multiplica pela quantidade
      const volumeM3 = (item.length * item.width * item.thickness) / 1_000_000_000;
      return total + (volumeM3 * item.quantity);
    }, 0);
}

/**
 * Calcula o custo total de materiais para um produto
 */
export function calculateMaterialCost(bom: BOMItem[]): number {
  return bom.reduce((total, item) => total + item.cost, 0);
}

/**
 * Calcula o tempo total de processo em minutos
 */
export function calculateTotalProcessTime(processes: Process[]): number {
  return processes.reduce((total, process) => total + process.timeMinutes, 0);
}

/**
 * Calcula o custo de mão de obra
 */
export function calculateLaborCost(processes: Process[], laborRate: number): number {
  const totalLaborHours = processes.reduce((total, process) => total + process.laborHours, 0);
  return totalLaborHours * laborRate;
}

/**
 * Calcula o custo de máquina
 */
export function calculateMachineCost(processes: Process[], machineRate: number): number {
  const totalMachineHours = processes.reduce((total, process) => total + process.machineHours, 0);
  return totalMachineHours * machineRate;
}

/**
 * Calcula a produtividade nominal em peças por hora
 */
export function calculateProductivity(totalProcessTime: number): number {
  if (totalProcessTime === 0) return 0;
  return 60 / totalProcessTime; // 60 minutos / tempo total em minutos
}

/**
 * Calcula o custo unitário total de um produto
 */
export function calculateUnitCost(
  product: Product,
  processes: Process[],
  rates: OperationalRates
): number {
  const materialCost = calculateMaterialCost(product.bom);
  const laborCost = calculateLaborCost(processes, rates.laborCostPerHour);
  const machineCost = calculateMachineCost(processes, rates.machineCostPerHour);
  
  // Custos diretos
  const directCost = materialCost + laborCost + machineCost;
  
  // Desperdício
  const wasteCost = materialCost * (rates.wastePercentage / 100);
  
  // Overhead
  const overheadCost = directCost * (rates.overheadPercentage / 100);
  
  return directCost + wasteCost + overheadCost;
}

/**
 * Calcula o OEE (Overall Equipment Effectiveness)
 */
export function calculateOEE(
  availability: number,
  performance: number,
  quality: number
): number {
  return (availability / 100) * (performance / 100) * (quality / 100) * 100;
}

/**
 * Calcula a disponibilidade baseada em tempo planejado vs tempo real
 */
export function calculateAvailability(
  plannedTime: number,
  actualTime: number,
  downtime: number
): number {
  if (plannedTime === 0) return 0;
  const operatingTime = actualTime - downtime;
  return (operatingTime / plannedTime) * 100;
}

/**
 * Calcula a performance baseada em produção planejada vs real
 */
export function calculatePerformance(
  plannedProduction: number,
  actualProduction: number,
  cycleTime: number,
  operatingTime: number
): number {
  if (operatingTime === 0) return 0;
  const idealCycleTime = plannedProduction * cycleTime;
  return (idealCycleTime / operatingTime) * 100;
}

/**
 * Calcula a qualidade baseada em peças boas vs total produzido
 */
export function calculateQuality(
  goodPieces: number,
  totalProduced: number
): number {
  if (totalProduced === 0) return 0;
  return (goodPieces / totalProduced) * 100;
}

/**
 * Calcula a taxa de refugo
 */
export function calculateRejectionRate(
  rejectedPieces: number,
  totalProduced: number
): number {
  if (totalProduced === 0) return 0;
  return (rejectedPieces / totalProduced) * 100;
}

/**
 * Calcula a taxa de retrabalho
 */
export function calculateReworkRate(
  reworkPieces: number,
  totalProduced: number
): number {
  if (totalProduced === 0) return 0;
  return (reworkPieces / totalProduced) * 100;
}

/**
 * Calcula o First Pass Yield (rendimento de primeira passagem)
 */
export function calculateFirstPassYield(
  goodPieces: number,
  totalProduced: number
): number {
  if (totalProduced === 0) return 0;
  return (goodPieces / totalProduced) * 100;
}

/**
 * Formata valores monetários em Real brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata números com casas decimais
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formata percentuais
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Converte minutos para formato horas:minutos
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h${mins.toString().padStart(2, '0')}min`;
}

/**
 * Calcula a diferença percentual entre dois valores
 */
export function calculatePercentageDifference(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Determina a cor do indicador baseado no valor e meta
 */
export function getKPIColor(
  value: number,
  target: number,
  isHigherBetter: boolean = true
): 'green' | 'yellow' | 'red' {
  const tolerance = 0.1; // 10% de tolerância
  
  if (isHigherBetter) {
    if (value >= target) return 'green';
    if (value >= target * (1 - tolerance)) return 'yellow';
    return 'red';
  } else {
    if (value <= target) return 'green';
    if (value <= target * (1 + tolerance)) return 'yellow';
    return 'red';
  }
}

/**
 * Gera ID único para novos registros
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Valida se uma data está no formato correto
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calcula a média de um array de números
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calcula o desvio padrão de um array de números
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const average = calculateAverage(values);
  const squaredDifferences = values.map(value => Math.pow(value - average, 2));
  const variance = calculateAverage(squaredDifferences);
  return Math.sqrt(variance);
}

/**
 * Agrupa array de objetos por uma propriedade
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Ordena array de objetos por uma propriedade
 */
export function sortBy<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Filtra array removendo valores duplicados
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Debounce function para otimizar performance em inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}