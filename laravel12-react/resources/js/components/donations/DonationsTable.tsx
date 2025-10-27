import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DonationImportModal } from './DonationImportModal';
import { Button } from '@/components/ui/button';
import { RefreshCw, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Donation {
  id: number;
  donor_name: string;
  amount: number;
  description?: string;
  created_at: string;
  is_imported: boolean;
  shelter_name?: string;
}

interface DonationStats {
  total_donations: number;
  total_amount: number;
  imported_donations: number;
  direct_donations: number;
}

interface DonationsTableProps {
  userRole: string;
}

export function DonationsTable({ userRole }: DonationsTableProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonations = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/donations?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar donaciones');
      }

      const data = await response.json();
      setDonations(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar donaciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/donations/stats', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const handleImportSuccess = () => {
    fetchDonations(currentPage);
    fetchStats();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          Cargando donaciones...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_donations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total_amount)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Importadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.imported_donations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Directas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.direct_donations}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de donaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Donaciones</CardTitle>
              <CardDescription>
                Lista de todas las donaciones {userRole === 'aliado' ? 'de tu refugio' : 'registradas'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchDonations(currentPage)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              {userRole === 'aliado' && (
                <DonationImportModal onImportSuccess={handleImportSuccess} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {donations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No hay donaciones registradas</p>
              {userRole === 'aliado' && (
                <p className="text-sm text-gray-400 mt-2">
                  Usa el botón "Importar Excel" para comenzar
                </p>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donante</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">
                        {donation.donor_name}
                        {donation.shelter_name && donation.is_imported && (
                          <div className="text-sm text-gray-500">
                            Refugio: {donation.shelter_name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(donation.amount)}
                      </TableCell>
                      <TableCell>{formatDate(donation.created_at)}</TableCell>
                      <TableCell>
                        {donation.description ? (
                          <span className="text-sm">{donation.description}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin descripción</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={donation.is_imported ? 'secondary' : 'default'}>
                          {donation.is_imported ? 'Importada' : 'Directa'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchDonations(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchDonations(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}