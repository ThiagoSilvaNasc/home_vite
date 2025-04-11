import React from 'react';
import { useEffect, useState } from "react";
import { Droplet, Bus, MapPin, User, Calendar, Clock, Users, Building2, Fuel } from 'lucide-react';
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseDatabase";

// Types
type EventoAbastecimento = {
  id: number;
  unidade: string;
  operador: {
    nome: string;
    codigo: string;
  };
  veiculo: {
    modelo: string;
    placa: string;
    codigo: string;
  };
  quantidade: number;
  data: string;
  hora: string;
};

type Usuario = {
  id: number;
  nome: string;
  codigo: string;
  cargo: string;
  unidade: string;
  email: string;
};

type Onibus = {
  id: number;
  modelo: string;
  placa: string;
  codigo: string;
  capacidadeTanque: number;
  unidade: string;
};

type Unidade = {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  estoqueCombustivel: number;
};



const usuarios: Usuario[] = [
  { id: 1, nome: "João Silva", codigo: "00-12-AB-FE-00-23-44-FF", cargo: "Operador", unidade: "São Paulo - SP", email: "joao.silva@empresa.com" },
  { id: 2, nome: "Maria Santos", codigo: "00-12-AB-FE-00-23-44-FF", cargo: "Supervisora", unidade: "Campinas - SP", email: "maria.santos@empresa.com" },
  { id: 3, nome: "Pedro Oliveira", codigo: "00-12-AB-FE-00-23-44-FF", cargo: "Operador", unidade: "São Paulo - SP", email: "pedro.oliveira@empresa.com" }
];

const onibus: Onibus[] = [
  { id: 1, modelo: "Mercedes-Benz O500", placa: "ABC-1234", codigo: "12345", capacidadeTanque: 400, unidade: "São Paulo - SP" },
  { id: 2, modelo: "Volvo B270F", placa: "XYZ-5678", codigo: "12345", capacidadeTanque: 350, unidade: "Campinas - SP" },
  { id: 3, modelo: "Scania K310", placa: "DEF-5678", codigo: "12345", capacidadeTanque: 375, unidade: "São Paulo - SP" }
];

const unidades: Unidade[] = [
  { id: 1, nome: "Garagem Central", cidade: "São Paulo", estado: "SP", estoqueCombustivel: 15000 },
  { id: 2, nome: "Terminal Campinas", cidade: "Campinas", estado: "SP", estoqueCombustivel: 8000 },
  { id: 3, nome: "Garagem Norte", cidade: "São Paulo", estado: "SP", estoqueCombustivel: 12000 }
];

function App() {
  const [eventos, setEventos] = useState<EventoAbastecimento[]>([]);
  const [activeTab, setActiveTab] = useState<'eventos' | 'usuarios' | 'onibus' | 'unidades'>('eventos');

  useEffect(() => {
    const eventosRef = ref(database, "eventos");

    onValue(eventosRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const parsed: EventoAbastecimento[] = Object.entries(data).map(([key, value]: any, index) => {
          const dateObj = new Date(value.timestamp * 1000);

          return {
            id: index + 1, // ou usar key, se quiser algo único
            unidade: value.local || "Desconhecido",
            operador: {
              nome: value.usuario || "Sem nome",
              codigo: value.CodUsuario || "",
            },
            veiculo: {
              modelo: value.veiculo || "Modelo desconhecido",
              placa: value.PlacaVeiculo || "Sem placa",
              codigo: value.CodVeiculo || "",
            },
            quantidade: value.litros || 0,
            data: dateObj.toLocaleDateString("pt-BR"),
            hora: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          };
        });

        parsed.sort((a, b) => (a.data < b.data || a.hora < b.hora ? 1 : -1)); // ordena por data/hora

        setEventos(parsed);
      }
    });
  }, []);
  
  const tabs = [
    { id: 'eventos', label: 'Dashboard de Eventos', icon: Droplet },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'onibus', label: 'Ônibus', icon: Bus },
    { id: 'unidades', label: 'Unidades', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Droplet className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Gestão de Abastecimento</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {activeTab === 'eventos' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Eventos de Abastecimento
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operador
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veículo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade (L)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventos.map((evento) => (
                      <tr key={evento.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{evento.unidade}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">{evento.operador.nome}</div>
                              <div className="text-sm text-gray-500">{evento.operador.codigo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Bus className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">{evento.veiculo.modelo}</div>
                              <div className="text-sm text-gray-500">
                                Placa: {evento.veiculo.placa} | Código: {evento.veiculo.codigo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-900">
                              {evento.quantidade.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{evento.data}</div>
                            <Clock className="h-5 w-5 text-gray-400 mx-2" />
                            <div className="text-sm text-gray-900">{evento.hora}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'usuarios' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lista de Usuários
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cargo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{usuario.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{usuario.codigo}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{usuario.cargo}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{usuario.unidade}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{usuario.email}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'onibus' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lista de Ônibus
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modelo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placa / Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacidade do Tanque
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {onibus.map((bus) => (
                      <tr key={bus.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Bus className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{bus.modelo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">Placa: {bus.placa}</div>
                            <div className="text-sm text-gray-500">Código: {bus.codigo}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Fuel className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{bus.capacidadeTanque}L</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{bus.unidade}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'unidades' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lista de Unidades
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque de Combustível
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unidades.map((unidade) => (
                      <tr key={unidade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{unidade.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{unidade.cidade}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{unidade.estado}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-900">{unidade.estoqueCombustivel.toLocaleString()}L</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;