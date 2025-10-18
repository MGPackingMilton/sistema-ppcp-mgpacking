// Dados de exemplo para demonstração do sistema PPCP

import { 
  Product, 
  Process, 
  ProductionOrder, 
  QualityRecord, 
  MaterialParameter, 
  OperationalRates,
  DailyProduction,
  ProductionLine,
  Machine,
  PerformanceTargets
} from './types';

// Produtos de exemplo
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Pallet PBR 1000x1200',
    code: 'PBR-1000-1200',
    client: 'Petrobras',
    description: 'Pallet padrão PBR para indústria petroquímica',
    bom: [
      {
        id: '1',
        sequence: 1,
        description: 'Tábua Superior 100x20x1000',
        quantity: 7,
        unit: 'pç',
        length: 1000,
        width: 100,
        thickness: 20,
        volume: 0.014,
        materialType: 'madeira',
        cost: 11.90,
        supplier: 'Madeireira São Paulo',
        observations: 'Eucalipto tratado'
      },
      {
        id: '2',
        sequence: 2,
        description: 'Tábua Inferior 100x20x1000',
        quantity: 3,
        unit: 'pç',
        length: 1000,
        width: 100,
        thickness: 20,
        volume: 0.006,
        materialType: 'madeira',
        cost: 5.10,
        supplier: 'Madeireira São Paulo',
        observations: 'Eucalipto tratado'
      },
      {
        id: '3',
        sequence: 3,
        description: 'Taco 100x100x145',
        quantity: 9,
        unit: 'pç',
        length: 145,
        width: 100,
        thickness: 100,
        volume: 0.013,
        materialType: 'madeira',
        cost: 11.05,
        supplier: 'Madeireira São Paulo',
        observations: 'Eucalipto tratado'
      },
      {
        id: '4',
        sequence: 4,
        description: 'Prego 50x2.8mm',
        quantity: 84,
        unit: 'pç',
        length: 50,
        width: 2.8,
        thickness: 2.8,
        volume: 0,
        materialType: 'prego',
        cost: 2.52,
        supplier: 'Gerdau',
        observations: 'Prego galvanizado'
      }
    ],
    processes: ['1', '2', '3', '4'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Caixa Exportação 600x400x300',
    code: 'CX-600-400-300',
    client: 'Exportadora ABC',
    description: 'Caixa de madeira para exportação de frutas',
    bom: [
      {
        id: '5',
        sequence: 1,
        description: 'Lateral 600x300x15',
        quantity: 2,
        unit: 'pç',
        length: 600,
        width: 300,
        thickness: 15,
        volume: 0.0054,
        materialType: 'madeira',
        cost: 4.59,
        supplier: 'Madeireira São Paulo'
      },
      {
        id: '6',
        sequence: 2,
        description: 'Lateral 400x300x15',
        quantity: 2,
        unit: 'pç',
        length: 400,
        width: 300,
        thickness: 15,
        volume: 0.0036,
        materialType: 'madeira',
        cost: 3.06,
        supplier: 'Madeireira São Paulo'
      },
      {
        id: '7',
        sequence: 3,
        description: 'Fundo 600x400x15',
        quantity: 1,
        unit: 'pç',
        length: 600,
        width: 400,
        thickness: 15,
        volume: 0.0036,
        materialType: 'madeira',
        cost: 3.06,
        supplier: 'Madeireira São Paulo'
      }
    ],
    processes: ['1', '2', '5'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

// Processos de exemplo
export const sampleProcesses: Process[] = [
  {
    id: '1',
    sequence: 1,
    name: 'Corte de Madeira',
    description: 'Corte das peças conforme especificação',
    timeMinutes: 8,
    machineHours: 0.13,
    laborHours: 0.13,
    machineType: 'Serra Circular',
    skillLevel: 'intermediário',
    observations: 'Serra circular automática com guia laser',
    qualityCheckpoints: [
      {
        id: '1',
        name: 'Dimensões',
        type: 'dimensional',
        specification: 'Conforme desenho',
        tolerance: '±2mm',
        required: true
      }
    ]
  },
  {
    id: '2',
    sequence: 2,
    name: 'Pré-furação',
    description: 'Furação dos pontos de fixação',
    timeMinutes: 5,
    machineHours: 0.08,
    laborHours: 0.08,
    machineType: 'Furadeira Múltipla',
    skillLevel: 'básico',
    observations: 'Furadeira pneumática com gabarito',
    qualityCheckpoints: [
      {
        id: '2',
        name: 'Posição dos furos',
        type: 'dimensional',
        specification: 'Conforme gabarito',
        tolerance: '±1mm',
        required: true
      }
    ]
  },
  {
    id: '3',
    sequence: 3,
    name: 'Montagem',
    description: 'Montagem e fixação das peças',
    timeMinutes: 12,
    machineHours: 0.05,
    laborHours: 0.20,
    machineType: 'Pregadeira Pneumática',
    skillLevel: 'intermediário',
    observations: 'Pregação pneumática com controle de pressão',
    qualityCheckpoints: [
      {
        id: '3',
        name: 'Esquadro',
        type: 'dimensional',
        specification: '90° ±1°',
        tolerance: '±1°',
        required: true
      },
      {
        id: '4',
        name: 'Fixação',
        type: 'funcional',
        specification: 'Pregos bem fixados',
        tolerance: 'N/A',
        required: true
      }
    ]
  },
  {
    id: '4',
    sequence: 4,
    name: 'Acabamento',
    description: 'Lixamento e inspeção final',
    timeMinutes: 5,
    machineHours: 0.02,
    laborHours: 0.08,
    machineType: 'Lixadeira',
    skillLevel: 'básico',
    observations: 'Lixamento manual e inspeção visual',
    qualityCheckpoints: [
      {
        id: '5',
        name: 'Acabamento superficial',
        type: 'visual',
        specification: 'Sem rebarbas ou defeitos',
        tolerance: 'N/A',
        required: true
      }
    ]
  },
  {
    id: '5',
    sequence: 2,
    name: 'Montagem de Caixa',
    description: 'Montagem específica para caixas',
    timeMinutes: 15,
    machineHours: 0.05,
    laborHours: 0.25,
    machineType: 'Pregadeira Pneumática',
    skillLevel: 'intermediário',
    observations: 'Montagem com cola e pregos',
    qualityCheckpoints: [
      {
        id: '6',
        name: 'Vedação',
        type: 'funcional',
        specification: 'Sem vazamentos',
        tolerance: 'N/A',
        required: true
      }
    ]
  }
];

// Ordens de produção de exemplo
export const sampleProductionOrders: ProductionOrder[] = [
  {
    id: 'OP001',
    productId: '1',
    productCode: 'PBR-1000-1200',
    productName: 'Pallet PBR 1000x1200',
    quantity: 500,
    quantityProduced: 350,
    quantityApproved: 340,
    quantityRejected: 10,
    line: 'Linha 1',
    shift: 'manhã',
    priority: 'alta',
    startDate: '2024-01-15T06:00:00Z',
    endDate: '2024-01-17T14:00:00Z',
    estimatedDuration: 32,
    actualDuration: 28,
    status: 'em_producao',
    operator: 'João Silva',
    supervisor: 'Carlos Santos',
    observations: 'Produção dentro do prazo',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-17T14:00:00Z'
  },
  {
    id: 'OP002',
    productId: '1',
    productCode: 'PBR-1000-1200',
    productName: 'Pallet PBR 1000x1200',
    quantity: 300,
    quantityProduced: 0,
    quantityApproved: 0,
    quantityRejected: 0,
    line: 'Linha 2',
    shift: 'tarde',
    priority: 'normal',
    startDate: '2024-01-18T14:00:00Z',
    estimatedDuration: 20,
    status: 'planejada',
    operator: 'Maria Oliveira',
    supervisor: 'Carlos Santos',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'OP003',
    productId: '2',
    productCode: 'CX-600-400-300',
    productName: 'Caixa Exportação 600x400x300',
    quantity: 200,
    quantityProduced: 200,
    quantityApproved: 195,
    quantityRejected: 5,
    line: 'Linha 3',
    shift: 'manhã',
    priority: 'urgente',
    startDate: '2024-01-10T06:00:00Z',
    endDate: '2024-01-12T12:00:00Z',
    estimatedDuration: 15,
    actualDuration: 14,
    status: 'concluida',
    operator: 'Pedro Costa',
    supervisor: 'Ana Lima',
    observations: 'Concluída antes do prazo',
    createdAt: '2024-01-09T15:00:00Z',
    updatedAt: '2024-01-12T12:00:00Z'
  }
];

// Registros de qualidade de exemplo
export const sampleQualityRecords: QualityRecord[] = [
  {
    id: '1',
    orderId: 'OP001',
    productId: '1',
    date: '2024-01-16T10:00:00Z',
    shift: 'manhã',
    inspector: 'Roberto Qualidade',
    sampleSize: 50,
    approved: 48,
    rejected: 2,
    rework: 0,
    defects: [
      {
        id: '1',
        type: 'Dimensional',
        description: 'Tábua fora de esquadro',
        quantity: 2,
        severity: 'média',
        cause: 'Desalinhamento da serra',
        action: 'Ajustar guia da serra'
      }
    ],
    dimensions: [
      {
        id: '1',
        parameter: 'Comprimento',
        specification: '1000mm',
        measured: 999.5,
        unit: 'mm',
        tolerance: '±2mm',
        result: 'aprovado'
      },
      {
        id: '2',
        parameter: 'Largura',
        specification: '1200mm',
        measured: 1201.0,
        unit: 'mm',
        tolerance: '±2mm',
        result: 'aprovado'
      }
    ],
    observations: 'Qualidade dentro do padrão',
    createdAt: '2024-01-16T10:30:00Z'
  }
];

// Parâmetros de materiais
export const sampleMaterialParameters: MaterialParameter[] = [
  {
    id: '1',
    name: 'Eucalipto Tratado',
    type: 'madeira',
    unit: 'm³',
    costPerUnit: 850.00,
    supplier: 'Madeireira São Paulo',
    quality: 'Classe A',
    density: 650,
    moisture: 12,
    observations: 'Madeira tratada com CCA',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Prego Galvanizado 50mm',
    type: 'prego',
    unit: 'kg',
    costPerUnit: 8.50,
    supplier: 'Gerdau',
    quality: 'Industrial',
    observations: 'Prego galvanizado a fogo',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Cola PVA',
    type: 'cola',
    unit: 'l',
    costPerUnit: 12.00,
    supplier: 'Henkel',
    quality: 'D3',
    observations: 'Cola resistente à umidade',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Taxas operacionais
export const sampleOperationalRates: OperationalRates = {
  id: '1',
  laborCostPerHour: 25.00,
  machineCostPerHour: 45.00,
  overheadPercentage: 15,
  wastePercentage: 3,
  setupTimeMinutes: 30,
  maintenancePercentage: 5,
  energyCostPerHour: 8.50,
  updatedAt: '2024-01-15T00:00:00Z'
};

// Produção diária de exemplo
export const sampleDailyProduction: DailyProduction[] = [
  {
    id: '1',
    orderId: 'OP001',
    date: '2024-01-16',
    shift: 'manhã',
    operator: 'João Silva',
    line: 'Linha 1',
    processId: '1',
    processName: 'Corte de Madeira',
    quantityProduced: 120,
    quantityApproved: 118,
    quantityRejected: 2,
    quantityRework: 0,
    startTime: '06:00',
    endTime: '14:00',
    actualTime: 480,
    downtime: 30,
    downtimeReason: 'Troca de lâmina da serra',
    observations: 'Produção normal',
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    orderId: 'OP001',
    date: '2024-01-16',
    shift: 'tarde',
    operator: 'Maria Oliveira',
    line: 'Linha 1',
    processId: '2',
    processName: 'Pré-furação',
    quantityProduced: 110,
    quantityApproved: 110,
    quantityRejected: 0,
    quantityRework: 0,
    startTime: '14:00',
    endTime: '22:00',
    actualTime: 480,
    downtime: 15,
    downtimeReason: 'Limpeza de equipamento',
    observations: 'Sem problemas',
    createdAt: '2024-01-16T22:30:00Z'
  }
];

// Linhas de produção
export const sampleProductionLines: ProductionLine[] = [
  {
    id: '1',
    name: 'Linha 1',
    description: 'Linha principal para pallets',
    capacity: 4.5,
    machines: [
      {
        id: '1',
        name: 'Serra Circular SC-001',
        type: 'Serra Circular',
        model: 'Altendorf F45',
        capacity: 6.0,
        costPerHour: 45.00,
        maintenanceSchedule: 'Semanal',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-01-17',
        status: 'operando'
      },
      {
        id: '2',
        name: 'Furadeira FM-001',
        type: 'Furadeira Múltipla',
        model: 'Casadei F21',
        capacity: 8.0,
        costPerHour: 35.00,
        maintenanceSchedule: 'Quinzenal',
        lastMaintenance: '2024-01-05',
        nextMaintenance: '2024-01-19',
        status: 'operando'
      }
    ],
    operators: ['João Silva', 'Maria Oliveira'],
    active: true
  },
  {
    id: '2',
    name: 'Linha 2',
    description: 'Linha secundária para pallets',
    capacity: 3.8,
    machines: [
      {
        id: '3',
        name: 'Serra Circular SC-002',
        type: 'Serra Circular',
        model: 'Altendorf F45',
        capacity: 5.5,
        costPerHour: 45.00,
        maintenanceSchedule: 'Semanal',
        lastMaintenance: '2024-01-12',
        nextMaintenance: '2024-01-19',
        status: 'operando'
      }
    ],
    operators: ['Pedro Costa'],
    active: true
  },
  {
    id: '3',
    name: 'Linha 3',
    description: 'Linha especializada em caixas',
    capacity: 6.2,
    machines: [
      {
        id: '4',
        name: 'Serra Esquadrejadeira SE-001',
        type: 'Serra Esquadrejadeira',
        model: 'SCM Si400',
        capacity: 8.0,
        costPerHour: 50.00,
        maintenanceSchedule: 'Semanal',
        lastMaintenance: '2024-01-08',
        nextMaintenance: '2024-01-15',
        status: 'manutencao'
      }
    ],
    operators: ['Ana Lima'],
    active: true
  }
];

// Metas de performance
export const performanceTargets: PerformanceTargets = {
  productivity: 3.5, // pç/h
  rejectionRate: 3.0, // %
  reworkRate: 2.0, // %
  oee: 80.0, // %
  availability: 85.0, // %
  performance: 90.0, // %
  quality: 97.0, // %
  wastePercentage: 3.0 // %
};