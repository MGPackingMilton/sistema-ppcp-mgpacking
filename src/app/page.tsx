"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  Package, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Factory,
  FileText,
  Plus,
  Search,
  Filter
} from 'lucide-react';

// Importar tipos e dados
import { 
  Product, 
  Process, 
  ProductionOrder, 
  QualityRecord, 
  KPI,
  OperationalRates
} from '@/lib/types';
import { 
  sampleProducts,
  sampleProcesses,
  sampleProductionOrders,
  sampleQualityRecords,
  sampleOperationalRates,
  performanceTargets
} from '@/lib/sampleData';
import {
  calculateUnitCost,
  calculateWoodVolume,
  calculateProductivity,
  calculateTotalProcessTime,
  calculateOEE,
  formatCurrency,
  formatNumber,
  getKPIColor
} from '@/lib/utils';

export default function PPCPSystem() {
  // Estados principais
  const [products, setProducts] = useState<Product[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [qualityRecords, setQualityRecords] = useState<QualityRecord[]>([]);
  const [operationalRates, setOperationalRates] = useState<OperationalRates>(sampleOperationalRates);
  const [kpis, setKPIs] = useState<KPI>({
    unitCost: 0,
    materialCost: 0,
    laborCost: 0,
    machineCost: 0,
    overheadCost: 0,
    woodVolume: 0,
    productivity: 0,
    cycleTime: 0,
    throughput: 0,
    wastePercentage: 3,
    rejectionRate: 0,
    reworkRate: 0,
    firstPassYield: 0,
    oee: 0,
    availability: 0,
    performance: 0,
    quality: 0,
    setupTime: 0,
    downtime: 0,
    utilization: 0
  });

  // Estados de interface
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLine, setSelectedLine] = useState('all');

  // Dados iniciais
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    setProducts(sampleProducts);
    setProcesses(sampleProcesses);
    setProductionOrders(sampleProductionOrders);
    setQualityRecords(sampleQualityRecords);
    
    calculateKPIs(sampleProducts, sampleProcesses, sampleProductionOrders);
  };

  const calculateKPIs = (products: Product[], processes: Process[], orders: ProductionOrder[]) => {
    if (products.length === 0 || processes.length === 0) return;

    const product = products[0];
    const productProcesses = processes.filter(p => product.processes.includes(p.id));
    
    // Cálculos básicos
    const unitCost = calculateUnitCost(product, productProcesses, operationalRates);
    const woodVolume = calculateWoodVolume(product.bom);
    const totalProcessTime = calculateTotalProcessTime(productProcesses);
    const productivity = calculateProductivity(totalProcessTime);
    
    // Simulação de dados de qualidade e eficiência
    const availability = 85; // 85%
    const performance = 92; // 92%
    const quality = 97; // 97%
    const oee = calculateOEE(availability, performance, quality);
    
    // Cálculo de taxas baseado nas ordens
    const totalProduced = orders.reduce((sum, order) => sum + order.quantityProduced, 0);
    const totalRejected = orders.reduce((sum, order) => sum + order.quantityRejected, 0);
    const rejectionRate = totalProduced > 0 ? (totalRejected / totalProduced) * 100 : 0;

    setKPIs({
      unitCost,
      materialCost: product.bom.reduce((sum, item) => sum + item.cost, 0),
      laborCost: productProcesses.reduce((sum, p) => sum + p.laborHours, 0) * operationalRates.laborCostPerHour,
      machineCost: productProcesses.reduce((sum, p) => sum + p.machineHours, 0) * operationalRates.machineCostPerHour,
      overheadCost: unitCost * (operationalRates.overheadPercentage / 100),
      woodVolume,
      productivity,
      cycleTime: totalProcessTime,
      throughput: productivity * 8, // 8 horas de trabalho
      wastePercentage: operationalRates.wastePercentage,
      rejectionRate,
      reworkRate: 0.8,
      firstPassYield: quality,
      oee,
      availability,
      performance,
      quality,
      setupTime: operationalRates.setupTimeMinutes,
      downtime: 30,
      utilization: 85
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-500';
      case 'em_producao': return 'bg-blue-500';
      case 'planejada': return 'bg-yellow-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'em_producao': return 'Em Produção';
      case 'planejada': return 'Planejada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getKPIStatus = (value: number, target: number, isHigherBetter: boolean = true) => {
    const color = getKPIColor(value, target, isHigherBetter);
    switch (color) {
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Factory className="text-blue-600" />
                PPCP - MG Packing
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema de Planejamento, Programação e Controle da Produção
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Mogi Guaçu/SP • Cabo de Santo Agostinho/PE
              </Badge>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Produção
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Qualidade
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Parâmetros
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Custo Unitário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(kpis.unitCost)}
                  </div>
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Volume Madeira
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(kpis.woodVolume, 3)} m³
                  </div>
                  <div className="flex items-center mt-1">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Produtividade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getKPIStatus(kpis.productivity, performanceTargets.productivity)}`}>
                    {formatNumber(kpis.productivity, 1)} pç/h
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 ml-1">Meta: {'>'}{performanceTargets.productivity}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Refugo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getKPIStatus(kpis.rejectionRate, performanceTargets.rejectionRate, false)}`}>
                    {formatNumber(kpis.rejectionRate, 1)}%
                  </div>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 ml-1">Meta: &lt;{performanceTargets.rejectionRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Desperdício
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(kpis.wastePercentage, 1)}%
                  </div>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    OEE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getKPIStatus(kpis.oee, performanceTargets.oee)}`}>
                    {formatNumber(kpis.oee, 1)}%
                  </div>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 ml-1">Meta: {'>'}{performanceTargets.oee}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas */}
            <div className="space-y-3">
              {kpis.productivity < performanceTargets.productivity && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Atenção:</strong> Produtividade abaixo da meta ({performanceTargets.productivity} pç/h). 
                    Atual: {formatNumber(kpis.productivity, 1)} pç/h
                  </AlertDescription>
                </Alert>
              )}
              
              {kpis.oee < performanceTargets.oee && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Crítico:</strong> OEE abaixo da meta ({performanceTargets.oee}%). 
                    Atual: {formatNumber(kpis.oee, 1)}%
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Ordens de Produção Ativas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  Ordens de Produção Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productionOrders.map((order) => {
                    const product = products.find(p => p.id === order.productId);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-600">
                              {order.productName} • {order.quantity} peças
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{order.line}</div>
                          <div className="text-xs text-gray-500">{order.shift}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Cadastro de Produtos</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Produto
              </Button>
            </div>

            <div className="grid gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Código: {product.code} • Cliente: {product.client}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium">Lista de Materiais (BOM)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Seq</th>
                              <th className="text-left p-2">Descrição</th>
                              <th className="text-right p-2">Qtd</th>
                              <th className="text-right p-2">Dimensões (mm)</th>
                              <th className="text-right p-2">Volume (m³)</th>
                              <th className="text-right p-2">Custo (R$)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.bom.map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="p-2">{item.sequence}</td>
                                <td className="p-2">{item.description}</td>
                                <td className="text-right p-2">{item.quantity} {item.unit}</td>
                                <td className="text-right p-2">
                                  {item.length}×{item.width}×{item.thickness}
                                </td>
                                <td className="text-right p-2">{formatNumber(item.volume, 3)}</td>
                                <td className="text-right p-2">{formatCurrency(item.cost)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="font-medium bg-gray-50">
                              <td className="p-2" colSpan={4}>Total</td>
                              <td className="text-right p-2">
                                {formatNumber(product.bom.reduce((sum, item) => sum + item.volume, 0), 3)} m³
                              </td>
                              <td className="text-right p-2">
                                {formatCurrency(product.bom.reduce((sum, item) => sum + item.cost, 0))}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Produção */}
          <TabsContent value="production" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Controle de Produção</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Buscar OP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nova OP
                </Button>
              </div>
            </div>

            {/* Processos */}
            <Card>
              <CardHeader>
                <CardTitle>Processos Produtivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Seq</th>
                        <th className="text-left p-3">Processo</th>
                        <th className="text-right p-3">Tempo (min)</th>
                        <th className="text-right p-3">H.Máquina</th>
                        <th className="text-right p-3">H.Homem</th>
                        <th className="text-left p-3">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processes.map((process) => (
                        <tr key={process.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{process.sequence}</td>
                          <td className="p-3 font-medium">{process.name}</td>
                          <td className="text-right p-3">{process.timeMinutes}</td>
                          <td className="text-right p-3">{formatNumber(process.machineHours, 2)}</td>
                          <td className="text-right p-3">{formatNumber(process.laborHours, 2)}</td>
                          <td className="p-3 text-gray-600">{process.observations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Ordens de Produção */}
            <Card>
              <CardHeader>
                <CardTitle>Ordens de Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productionOrders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <div>
                            <div className="font-medium text-lg">{order.id}</div>
                            <div className="text-gray-600">
                              {order.productName}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">{order.quantity} peças</div>
                          <div className="text-sm text-gray-600">
                            {order.line} • {order.shift}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Início: {new Date(order.startDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div>Produzido: {order.quantityProduced}/{order.quantity}</div>
                        <div>Aprovado: {order.quantityApproved}</div>
                        <div>Refugo: {order.quantityRejected}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Qualidade */}
          <TabsContent value="quality" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Controle de Qualidade</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Inspeção
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Aprovados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatNumber(kpis.quality, 1)}%</div>
                  <p className="text-sm text-gray-600">Meta: {'>'}{performanceTargets.quality}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Refugo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatNumber(kpis.rejectionRate, 1)}%</div>
                  <p className="text-sm text-gray-600">Meta: &lt;{performanceTargets.rejectionRate}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-600">Retrabalho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatNumber(kpis.reworkRate, 1)}%</div>
                  <p className="text-sm text-gray-600">Meta: &lt;{performanceTargets.reworkRate}%</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Registros de Inspeção</CardTitle>
              </CardHeader>
              <CardContent>
                {qualityRecords.length > 0 ? (
                  <div className="space-y-4">
                    {qualityRecords.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">OP: {record.orderId}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(record.date).toLocaleDateString('pt-BR')} - {record.shift}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Amostra:</span> {record.sampleSize}
                          </div>
                          <div>
                            <span className="text-gray-600">Aprovados:</span> {record.approved}
                          </div>
                          <div>
                            <span className="text-gray-600">Rejeitados:</span> {record.rejected}
                          </div>
                          <div>
                            <span className="text-gray-600">Retrabalho:</span> {record.rework}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Inspetor: {record.inspector}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum registro de inspeção encontrado.</p>
                    <p className="text-sm">Clique em "Nova Inspeção" para começar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  Exportar PDF
                </Button>
                <Button variant="outline">
                  Exportar Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatório de Produção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Produzido (mês)</span>
                      <span className="font-medium">
                        {productionOrders.reduce((sum, order) => sum + order.quantityProduced, 0)} peças
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consumo de Madeira</span>
                      <span className="font-medium">
                        {formatNumber(kpis.woodVolume * productionOrders.reduce((sum, order) => sum + order.quantityProduced, 0), 2)} m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo Total</span>
                      <span className="font-medium">
                        {formatCurrency(kpis.unitCost * productionOrders.reduce((sum, order) => sum + order.quantityProduced, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo Médio Unitário</span>
                      <span className="font-medium">{formatCurrency(kpis.unitCost)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análise de Eficiência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Disponibilidade</span>
                      <span className={`font-medium ${getKPIStatus(kpis.availability, performanceTargets.availability)}`}>
                        {formatNumber(kpis.availability, 0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance</span>
                      <span className={`font-medium ${getKPIStatus(kpis.performance, performanceTargets.performance)}`}>
                        {formatNumber(kpis.performance, 0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualidade</span>
                      <span className={`font-medium ${getKPIStatus(kpis.quality, performanceTargets.quality)}`}>
                        {formatNumber(kpis.quality, 0)}%
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">OEE Global</span>
                      <span className={`font-bold ${getKPIStatus(kpis.oee, performanceTargets.oee)}`}>
                        {formatNumber(kpis.oee, 1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Parâmetros */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Parâmetros do Sistema</h2>
              <Button onClick={() => calculateKPIs(products, processes, productionOrders)}>
                Recalcular KPIs
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custos Operacionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="laborCost">Custo Hora-Homem (R$/h)</Label>
                    <Input
                      id="laborCost"
                      type="number"
                      step="0.01"
                      value={operationalRates.laborCostPerHour}
                      onChange={(e) => setOperationalRates(prev => ({
                        ...prev,
                        laborCostPerHour: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineCost">Custo Hora-Máquina (R$/h)</Label>
                    <Input
                      id="machineCost"
                      type="number"
                      step="0.01"
                      value={operationalRates.machineCostPerHour}
                      onChange={(e) => setOperationalRates(prev => ({
                        ...prev,
                        machineCostPerHour: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parâmetros de Produção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="wastePercentage">Percentual de Desperdício (%)</Label>
                    <Input
                      id="wastePercentage"
                      type="number"
                      step="0.1"
                      value={operationalRates.wastePercentage}
                      onChange={(e) => setOperationalRates(prev => ({
                        ...prev,
                        wastePercentage: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="overheadPercentage">Percentual de Overhead (%)</Label>
                    <Input
                      id="overheadPercentage"
                      type="number"
                      step="0.1"
                      value={operationalRates.overheadPercentage}
                      onChange={(e) => setOperationalRates(prev => ({
                        ...prev,
                        overheadPercentage: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Metas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Produtividade</div>
                    <div className="text-2xl font-bold text-green-700">{'>'} {performanceTargets.productivity} pç/h</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">Refugo</div>
                    <div className="text-2xl font-bold text-red-700">&lt; {performanceTargets.rejectionRate}%</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">OEE</div>
                    <div className="text-2xl font-bold text-blue-700">{'>'} {performanceTargets.oee}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}