import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

// Componentes de UI
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// --- Interfaces para Tipado ---
interface Mascota {
    id: number;
    nombre: string;
    tipo: 'producto' | 'mascota';
}

interface AdopcionFormData {
    [key: string]: string | number | boolean; // Firma de índice para compatibilidad con Inertia
    nombre_completo: string;
    cedula: string;
    email: string;
    telefono: string;
    direccion_ciudad: string;
    direccion_barrio: string;
    direccion_postal: string;
    tipo_vivienda: string;
    propiedad_vivienda: string;
    tiene_patio: string;
    permiten_mascotas_alquiler: string;
    cantidad_convivientes: number;
    hay_ninos: string;
    edades_ninos: string;
    todos_acuerdo_adopcion: string;
    tiene_otras_mascotas: string;
    otras_mascotas_detalles: string;
    tuvo_mascotas_antes: string;
    que_paso_mascotas_anteriores: string;
    mascota_id: number;
    porque_adopta: string;
    que_espera_convivencia: string;
    que_haria_problemas_comportamiento: string;
    acepta_visitas_seguimiento: string;
    acepta_proceso_evaluacion: boolean;
    acepta_cuidado_responsable: boolean;
    acepta_contrato_adopcion: boolean;
}

interface FormularioAdopcionProps {
    mascota: Mascota;
    show: boolean;
    onClose: () => void;
}

// Componente de Sección reutilizable
const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="mb-8 rounded-lg border border-gray-300 p-6 dark:border-gray-600">
        <legend className="-ml-2 px-2 text-lg font-bold text-indigo-700 dark:text-indigo-400">{title}</legend>
        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
);

export default function FormularioAdopcion({ mascota, show, onClose }: FormularioAdopcionProps) {
    const page = usePage();
    const auth = (page.props as unknown as { auth: { user: { name?: string; email?: string } } }).auth;

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<AdopcionFormData>({
        nombre_completo: auth.user.name || '',
        cedula: '',
        email: auth.user.email || '',
        telefono: '',
        direccion_ciudad: '',
        direccion_barrio: '',
        direccion_postal: '',
        tipo_vivienda: '',
        propiedad_vivienda: '',
        tiene_patio: '',
        permiten_mascotas_alquiler: '',
        cantidad_convivientes: 0,
        hay_ninos: '',
        edades_ninos: '',
        todos_acuerdo_adopcion: '',
        tiene_otras_mascotas: 'no',
        otras_mascotas_detalles: '',
        tuvo_mascotas_antes: '',
        que_paso_mascotas_anteriores: '',
        mascota_id: mascota.id,
        porque_adopta: '',
        que_espera_convivencia: '',
        que_haria_problemas_comportamiento: '',
        acepta_visitas_seguimiento: '',
        acepta_proceso_evaluacion: false,
        acepta_cuidado_responsable: false,
        acepta_contrato_adopcion: false,
    });

    // Estados para campos condicionales
    const [viviendaAlquilada, setViviendaAlquilada] = useState(false);
    const [hayNinos, setHayNinos] = useState(false);

    useEffect(() => {
        if (wasSuccessful) {
            onClose();
            reset();
        }
    }, [wasSuccessful, onClose, reset]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('solicitudes.adopcion.store'), {
            // Asegúrate de que esta ruta exista en tu backend
            preserveScroll: true,
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl rounded-2xl bg-gray-50 shadow-2xl dark:bg-gray-800">
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white transition-transform hover:scale-110 hover:bg-red-500"
                    aria-label="Cerrar formulario"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="max-h-[90vh] overflow-y-auto p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Solicitud de Adopción para <span className="text-indigo-600 dark:text-indigo-400">{mascota.nombre}</span>
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Gracias por tu interés en darle un hogar. Por favor, completa el siguiente formulario.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
                        <FormSection title="1. Información Personal del Adoptante">
                            <div className="md:col-span-1">
                                <Label htmlFor="nombre_completo">Nombre Completo</Label>
                                <Input
                                    id="nombre_completo"
                                    value={data.nombre_completo}
                                    onChange={(e) => setData('nombre_completo', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nombre_completo} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="cedula">Cédula o Documento de Identidad</Label>
                                <Input id="cedula" value={data.cedula} onChange={(e) => setData('cedula', e.target.value)} required />
                                <InputError message={errors.cedula} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                <InputError message={errors.email} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="telefono">Número de Teléfono</Label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    required
                                />
                                <InputError message={errors.telefono} className="mt-1" />
                            </div>
                            <div className="md:col-span-1">
                                <Label htmlFor="direccion_ciudad">Ciudad</Label>
                                <Input
                                    id="direccion_ciudad"
                                    value={data.direccion_ciudad}
                                    onChange={(e) => setData('direccion_ciudad', e.target.value)}
                                    required
                                />
                                <InputError message={errors.direccion_ciudad} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="direccion_barrio">Barrio</Label>
                                <Input
                                    id="direccion_barrio"
                                    value={data.direccion_barrio}
                                    onChange={(e) => setData('direccion_barrio', e.target.value)}
                                    required
                                />
                                <InputError message={errors.direccion_barrio} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="direccion_postal">Código Postal</Label>
                                <Input
                                    id="direccion_postal"
                                    value={data.direccion_postal}
                                    onChange={(e) => setData('direccion_postal', e.target.value)}
                                />
                                <InputError message={errors.direccion_postal} className="mt-1" />
                            </div>
                        </FormSection>

                        {/* SECCIÓN 2: INFORMACIÓN SOBRE LA VIVIENDA */}
                        <FormSection title="2. Información Sobre la Vivienda">
                            <div className="space-y-2">
                                <Label>Tipo de Vivienda</Label>
                                <Select onValueChange={(value) => setData('tipo_vivienda', value)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="casa">Casa</SelectItem>
                                        <SelectItem value="apartamento">Apartamento</SelectItem>
                                        <SelectItem value="finca">Finca</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>¿La Vivienda es?</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setData('propiedad_vivienda', value);
                                        setViviendaAlquilada(value === 'alquilada');
                                    }}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="propia">Propia</SelectItem>
                                        <SelectItem value="alquilada">Alquilada</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {viviendaAlquilada && (
                                <div className="space-y-2">
                                    <Label>¿Permiten mascotas en la vivienda?</Label>
                                    <RadioGroup
                                        onValueChange={(value: string) => setData('permiten_mascotas_alquiler', value)}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="si" id="permiso_si" />
                                            <Label htmlFor="permiso_si">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="permiso_no" />
                                            <Label htmlFor="permiso_no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>¿Cuenta con patio o espacio exterior?</Label>
                                <RadioGroup onValueChange={(value: string) => setData('tiene_patio', value)} className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="patio_si" />
                                        <Label htmlFor="patio_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="patio_no" />
                                        <Label htmlFor="patio_no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </FormSection>

                        {/* SECCIÓN 3: INFORMACIÓN SOBRE CONVIVIENTES */}
                        <FormSection title="3. Información Sobre Convivientes">
                            <div className="md:col-span-1">
                                <Label htmlFor="cantidad_convivientes">¿Con cuántas personas vive?</Label>
                                <Input
                                    id="cantidad_convivientes"
                                    type="number"
                                    value={data.cantidad_convivientes}
                                    onChange={(e) => setData('cantidad_convivientes', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>¿Hay niños en casa?</Label>
                                <RadioGroup
                                    onValueChange={(value: string) => {
                                        setData('hay_ninos', value);
                                        setHayNinos(value === 'si');
                                    }}
                                    className="flex gap-4 pt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="ninos_si" />
                                        <Label htmlFor="ninos_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="ninos_no" />
                                        <Label htmlFor="ninos_no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            {hayNinos && (
                                <div className="md:col-span-1">
                                    <Label htmlFor="edades_ninos">¿Qué edades tienen?</Label>
                                    <Input
                                        id="edades_ninos"
                                        value={data.edades_ninos}
                                        onChange={(e) => setData('edades_ninos', e.target.value)}
                                        placeholder="Ej: 3, 7, 12"
                                    />
                                </div>
                            )}
                            <div className="space-y-2 md:col-span-2">
                                <Label>¿Todos en casa están de acuerdo con la adopción?</Label>
                                <RadioGroup onValueChange={(value: string) => setData('todos_acuerdo_adopcion', value)} className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="acuerdo_si" />
                                        <Label htmlFor="acuerdo_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="acuerdo_no" />
                                        <Label htmlFor="acuerdo_no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </FormSection>

                        {/* SECCIÓN 4: INFORMACIÓN SOBRE OTRAS MASCOTAS */}
                        <FormSection title="4. Información Sobre Otras Mascotas">
                            <div className="space-y-2">
                                <Label>¿Tiene otras mascotas actualmente?</Label>
                                <RadioGroup onValueChange={(value) => setData('tiene_otras_mascotas', value)} className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="otras_mascotas_si" />
                                        <Label htmlFor="otras_mascotas_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="otras_mascotas_no" />
                                        <Label htmlFor="otras_mascotas_no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>¿Ha tenido mascotas anteriormente?</Label>
                                <RadioGroup onValueChange={(value) => setData('tuvo_mascotas_antes', value)} className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="mascotas_antes_si" />
                                        <Label htmlFor="mascotas_antes_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="mascotas_antes_no" />
                                        <Label htmlFor="mascotas_antes_no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </FormSection>

                        {/* SECCIÓN 5: DETALLES SOBRE LA ADOPCIÓN */}
                        <FormSection title="5. Detalles Sobre la Adopción">
                            <div className="md:col-span-3">
                                <Label htmlFor="porque_adopta">¿Por qué quiere adoptar a {mascota.nombre}?</Label>
                                <Textarea
                                    id="porque_adopta"
                                    value={data.porque_adopta}
                                    onChange={(e: { target: { value: string } }) => setData('porque_adopta', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-3">
                                <Label htmlFor="que_espera_convivencia">¿Qué espera de la convivencia con la mascota?</Label>
                                <Textarea
                                    id="que_espera_convivencia"
                                    value={data.que_espera_convivencia}
                                    onChange={(e: { target: { value: string } }) => setData('que_espera_convivencia', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <Label htmlFor="que_haria_problemas_comportamiento">
                                    ¿Qué haría si la mascota presenta problemas de comportamiento?
                                </Label>
                                <Textarea
                                    id="que_haria_problemas_comportamiento"
                                    value={data.que_haria_problemas_comportamiento}
                                    onChange={(e: { target: { value: string } }) => setData('que_haria_problemas_comportamiento', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <Label>¿Estaría dispuesto/a a recibir visitas de seguimiento?</Label>
                                <RadioGroup
                                    onValueChange={(value: string) => setData('acepta_visitas_seguimiento', value)}
                                    className="flex gap-4 pt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="visitas_si" />
                                        <Label htmlFor="visitas_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="visitas_no" />
                                        <Label htmlFor="visitas_no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </FormSection>

                        {/* SECCIÓN 6: COMPROMISOS Y CONDICIONES */}
                        <FormSection title="6. Compromisos y Condiciones">
                            <div className="space-y-4 lg:col-span-3">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="acepta_proceso_evaluacion"
                                        checked={data.acepta_proceso_evaluacion}
                                        onCheckedChange={(checked) => setData('acepta_proceso_evaluacion', !!checked)}
                                    />
                                    <Label htmlFor="acepta_proceso_evaluacion" className="font-normal">
                                        Acepto que esta solicitud no garantiza la adopción y que debo pasar por un proceso de evaluación.
                                    </Label>
                                </div>
                                <InputError message={errors.acepta_proceso_evaluacion} />

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="acepta_cuidado_responsable"
                                        checked={data.acepta_cuidado_responsable}
                                        onCheckedChange={(checked) => setData('acepta_cuidado_responsable', !!checked)}
                                    />
                                    <Label htmlFor="acepta_cuidado_responsable" className="font-normal">
                                        Me comprometo al cuidado responsable y permanente de la mascota, cubriendo todas sus necesidades.
                                    </Label>
                                </div>
                                <InputError message={errors.acepta_cuidado_responsable} />

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="acepta_contrato_adopcion"
                                        checked={data.acepta_contrato_adopcion}
                                        onCheckedChange={(checked) => setData('acepta_contrato_adopcion', !!checked)}
                                    />
                                    <Label htmlFor="acepta_contrato_adopcion" className="font-normal">
                                        Estoy dispuesto/a a firmar un contrato de adopción y cumplir con sus cláusulas.
                                    </Label>
                                </div>
                                <InputError message={errors.acepta_contrato_adopcion} />
                            </div>
                        </FormSection>

                        {/* BOTÓN DE ENVÍO */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700" disabled={processing}>
                                {processing ? 'Enviando Solicitud...' : 'Enviar Solicitud de Adopción'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
