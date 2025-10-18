// Tipos de dados para o sistema PPCP

export interface Product {
  id: string;
  name: string;
  code: string;
  client: string;
  description?: string;
  bom: BOMItem[];
  processes: string[]; // IDs dos processos
  createdAt: string;
  updatedAt: string;
}

export interface BOMItem {
  id: string;
  sequence: number;
  description: string;
  quantity: number;
  unit: 'pç' | 'kg' | 'l' | 'm' | 'm²' | 'm³';
  length: number; // mm
  width: number; // mm
  thickness: number; // mm
  volume: number; // m³
  materialType: 'madeira' | 'prego' | 'cola' | 'verniz' | 'outros';
  cost: number; // R$
  supplier?: string;
  observations?: string;
}

export interface Process {
  id: string;
  sequence: number;
  name: string;
  description: string;
  timeMinutes: number;
  machineHours: number;
  laborHours: number;
  machineType: string;
  skillLevel: 'básico' | 'intermediário' | 'avançado';
  observations: string;
  qualityCheckpoints: QualityCheckpoint[];
}

export interface QualityCheckpoint {
  id: string;
  name: string;
  type: 'dimensional' | 'visual' | 'funcional';
  specification: string;
  tolerance: string;
  required: boolean;
}

export interface ProductionOrder {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  quantityProduced: number;
  quantityApproved: number;
  quantityRejected: number;
  line: string;
  shift: 'manhã' | 'tarde' | 'noite';
  priority: 'baixa' | 'normal' | 'alta' | 'urgente';
  startDate: string;
  endDate?: string;
  estimatedDuration: number; // horas
  actualDuration?: number; // horas
  status: 'planejada' | 'em_producao' | 'pausada' | 'concluida' | 'cancelada';
  operator: string;
  supervisor: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyProduction {
  id: string;
  orderId: string;
  date: string;
  shift: 'manhã' | 'tarde' | 'noite';
  operator: string;
  line: string;
  processId: string;
  processName: string;
  quantityProduced: number;
  quantityApproved: number;
  quantityRejected: number;
  quantityRework: number;
  startTime: string;
  endTime: string;
  actualTime: number; // minutos
  downtime: number; // minutos
  downtimeReason?: string;
  observations?: string;
  createdAt: string;
}

export interface QualityRecord {
  id: string;
  orderId: string;
  productId: string;
  date: string;
  shift: 'manhã' | 'tarde' | 'noite';
  inspector: string;
  sampleSize: number;
  approved: number;
  rejected: number;
  rework: number;
  defects: QualityDefect[];
  dimensions: DimensionalCheck[];
  observations?: string;
  createdAt: string;
}

export interface QualityDefect {
  id: string;
  type: string;
  description: string;
  quantity: number;
  severity: 'baixa' | 'média' | 'alta' | 'crítica';
  cause?: string;
  action?: string;
}

export interface DimensionalCheck {
  id: string;
  parameter: string;
  specification: string;
  measured: number;
  unit: string;
  tolerance: string;
  result: 'aprovado' | 'reprovado';
}

export interface MaterialParameter {
  id: string;
  name: string;
  type: 'madeira' | 'prego' | 'cola' | 'verniz' | 'outros';
  unit: 'pç' | 'kg' | 'l' | 'm' | 'm²' | 'm³';
  costPerUnit: number; // R$
  supplier: string;
  quality: string;
  density?: number; // kg/m³ para madeira
  moisture?: number; // % para madeira
  observations?: string;
  updatedAt: string;
}

export interface OperationalRates {
  id: string;
  laborCostPerHour: number; // R$/h
  machineCostPerHour: number; // R$/h
  overheadPercentage: number; // %
  wastePercentage: number; // %
  setupTimeMinutes: number;
  maintenancePercentage: number; // %
  energyCostPerHour: number; // R$/h
  updatedAt: string;
}

export interface KPI {
  // Custos
  unitCost: number; // R$
  materialCost: number; // R$
  laborCost: number; // R$
  machineCost: number; // R$
  overheadCost: number; // R$
  
  // Produção
  woodVolume: number; // m³
  productivity: number; // pç/h
  cycleTime: number; // min/pç
  throughput: number; // pç/dia
  
  // Qualidade
  wastePercentage: number; // %
  rejectionRate: number; // %
  reworkRate: number; // %
  firstPassYield: number; // %
  
  // Eficiência
  oee: number; // %
  availability: number; // %
  performance: number; // %
  quality: number; // %
  
  // Tempos
  setupTime: number; // min
  downtime: number; // min
  utilization: number; // %
}

export interface ProductionSummary {
  period: string;
  totalProduced: number;
  totalApproved: number;
  totalRejected: number;
  totalRework: number;
  totalWoodVolume: number; // m³
  totalCost: number; // R$
  averageUnitCost: number; // R$
  averageProductivity: number; // pç/h
  oeeAverage: number; // %
  rejectionRateAverage: number; // %
  lines: LineSummary[];
  products: ProductSummary[];
}

export interface LineSummary {
  line: string;
  produced: number;
  approved: number;
  rejected: number;
  productivity: number; // pç/h
  oee: number; // %
  utilization: number; // %
}

export interface ProductSummary {
  productId: string;
  productName: string;
  produced: number;
  approved: number;
  rejected: number;
  unitCost: number; // R$
  woodVolume: number; // m³
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  source: 'production' | 'quality' | 'maintenance' | 'system';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'manager' | 'admin';
  permissions: string[];
  active: boolean;
  createdAt: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  description: string;
  capacity: number; // pç/h
  machines: Machine[];
  operators: string[];
  active: boolean;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  model: string;
  capacity: number; // pç/h
  costPerHour: number; // R$/h
  maintenanceSchedule: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'operando' | 'parada' | 'manutencao' | 'setup';
}

// Tipos para performance targets
export interface PerformanceTargets {
  productivity: number; // pç/h
  rejectionRate: number; // %
  reworkRate: number; // %
  oee: number; // %
  availability: number; // %
  performance: number; // %
  quality: number; // %
  wastePercentage: number; // %
}