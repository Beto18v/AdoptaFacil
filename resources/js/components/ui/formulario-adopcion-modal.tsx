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
import { X } from 'lucide-react';

// --- Interfaces para Tipado ---
interface MascotaAdopcion {
    id: number;
    name?: string;
    nombre?: string;
    type?: 'pet' | 'product';
    tipo?: 'producto' | 'mascota';
}

interface AdopcionFormData {
    [key: string]: string | number | boolean;
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

interface FormularioAdopcionModalProps {
    mascota: MascotaAdopcion;
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

export default function FormularioAdopcionModal({ mascota, show, onClose }: FormularioAdopcionModalProps) {
    const page = usePage();
    const auth = (page.props as { auth?: { user?: { name?: string; email?: string } } }).auth;
    
    // Obtener el nombre de la mascota de forma flexible
    const nombreMascota = mascota.name || mascota.nombre || 'Mascota';

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<AdopcionFormData>({
        nombre_completo: auth?.user?.name || '',
        cedula: '',
        email: auth?.user?.email || '',
        telefono: '',
        direccion_ciudad: '',
        direccion_barrio: '',
        direccion_postal: '',
        tipo_vivienda: 'casa',
        propiedad_vivienda: 'propia',
        tiene_patio: 'no',
        permiten_mascotas_alquiler: 'si',
        cantidad_convivientes: 1,
        hay_ninos: 'no',
        edades_ninos: '',
        todos_acuerdo_adopcion: 'si',
        tiene_otras_mascotas: 'no',
        otras_mascotas_detalles: '',
        tuvo_mascotas_antes: 'no',
        que_paso_mascotas_anteriores: '',
        mascota_id: mascota.id,
        porque_adopta: '',
        que_espera_convivencia: '',
        que_haria_problemas_comportamiento: '',
        acepta_visitas_seguimiento: 'si',
        acepta_proceso_evaluacion: false,
        acepta_cuidado_responsable: false,
        acepta_contrato_adopcion: false,
    });

    // Estados para campos condicionales
    const [viviendaAlquilada, setViviendaAlquilada] = useState(false);
    const [hayNinos, setHayNinos] = useState(false);
    const [tieneOtrasMascotas, setTieneOtrasMascotas] = useState(false);

    // Efectos para campos condicionales
    useEffect(() => {
        setViviendaAlquilada(data.propiedad_vivienda === 'alquilada');
    }, [data.propiedad_vivienda]);

    useEffect(() => {
        setHayNinos(data.hay_ninos === 'si');
    }, [data.hay_ninos]);

    useEffect(() => {
        setTieneOtrasMascotas(data.tiene_otras_mascotas === 'si');
    }, [data.tiene_otras_mascotas]);

    // Resetear formulario cuando se cierre
    useEffect(() => {
        if (wasSuccessful) {
            reset();
            onClose();
        }
    }, [wasSuccessful, reset, onClose]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('solicitudes.adopcion.store'), {
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
                    <X className="h-6 w-6" />
                </button>
                
                <div className="max-h-[90vh] overflow-y-auto p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Solicitud de Adopción para <span className="text-indigo-600 dark:text-indigo-400">{nombreMascota}</span>
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Gracias por tu interés en darle un hogar. Por favor, completa el siguiente formulario.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Información Personal */}
                        <FormSection title="📋 Información Personal">
                            <div className="space-y-2">
                                <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                                <Input
                                    id="nombre_completo"
                                    type="text"
                                    value={data.nombre_completo}
                                    onChange={(e) => setData('nombre_completo', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nombre_completo} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cedula">Número de Cédula *</Label>
                                <Input
                                    id="cedula"
                                    type="text"
                                    value={data.cedula}
                                    onChange={(e) => setData('cedula', e.target.value)}
                                    required
                                />
                                <InputError message={errors.cedula} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono *</Label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    required
                                />
                                <InputError message={errors.telefono} />
                            </div>
                        </FormSection>

                        {/* Información de Vivienda */}
                        <FormSection title="🏠 Información de Vivienda">
                            <div className="space-y-2">
                                <Label htmlFor="direccion_ciudad">Ciudad *</Label>
                                <Input
                                    id="direccion_ciudad"
                                    type="text"
                                    value={data.direccion_ciudad}
                                    onChange={(e) => setData('direccion_ciudad', e.target.value)}
                                    required
                                />
                                <InputError message={errors.direccion_ciudad} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion_barrio">Barrio/Localidad *</Label>
                                <Input
                                    id="direccion_barrio"
                                    type="text"
                                    value={data.direccion_barrio}
                                    onChange={(e) => setData('direccion_barrio', e.target.value)}
                                    required
                                />
                                <InputError message={errors.direccion_barrio} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo_vivienda">Tipo de Vivienda *</Label>
                                <Select value={data.tipo_vivienda} onValueChange={(value) => setData('tipo_vivienda', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="casa">Casa</SelectItem>
                                        <SelectItem value="apartamento">Apartamento</SelectItem>
                                        <SelectItem value="finca">Finca/Casa de Campo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tipo_vivienda} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="propiedad_vivienda">Propiedad de la Vivienda *</Label>
                                <Select value={data.propiedad_vivienda} onValueChange={(value) => setData('propiedad_vivienda', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="propia">Propia</SelectItem>
                                        <SelectItem value="alquilada">Alquilada</SelectItem>
                                        <SelectItem value="familiar">Familiar</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.propiedad_vivienda} />
                            </div>

                            <div className="space-y-2">
                                <Label>¿Tiene patio o espacio exterior? *</Label>
                                <RadioGroup value={data.tiene_patio} onValueChange={(value) => setData('tiene_patio', value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="patio_si" />
                                        <Label htmlFor="patio_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="patio_no" />
                                        <Label htmlFor="patio_no">No</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.tiene_patio} />
                            </div>

                            {viviendaAlquilada && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label>¿El propietario permite mascotas? *</Label>
                                    <RadioGroup 
                                        value={data.permiten_mascotas_alquiler} 
                                        onValueChange={(value) => setData('permiten_mascotas_alquiler', value)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="si" id="permite_si" />
                                            <Label htmlFor="permite_si">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="permite_no" />
                                            <Label htmlFor="permite_no">No</Label>
                                        </div>
                                    </RadioGroup>
                                    <InputError message={errors.permiten_mascotas_alquiler} />
                                </div>
                            )}
                        </FormSection>

                        {/* Información del Hogar */}
                        <FormSection title="👨‍👩‍👧‍👦 Información del Hogar">
                            <div className="space-y-2">
                                <Label htmlFor="cantidad_convivientes">¿Cuántas personas viven en casa? *</Label>
                                <Input
                                    id="cantidad_convivientes"
                                    type="number"
                                    min="1"
                                    value={data.cantidad_convivientes}
                                    onChange={(e) => setData('cantidad_convivientes', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <InputError message={errors.cantidad_convivientes} />
                            </div>

                            <div className="space-y-2">
                                <Label>¿Hay niños en casa? *</Label>
                                <RadioGroup value={data.hay_ninos} onValueChange={(value) => setData('hay_ninos', value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="ninos_si" />
                                        <Label htmlFor="ninos_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="ninos_no" />
                                        <Label htmlFor="ninos_no">No</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.hay_ninos} />
                            </div>

                            {hayNinos && (
                                <div className="space-y-2">
                                    <Label htmlFor="edades_ninos">¿Qué edades tienen? *</Label>
                                    <Input
                                        id="edades_ninos"
                                        type="text"
                                        placeholder="Ej: 5, 8, 12 años"
                                        value={data.edades_ninos}
                                        onChange={(e) => setData('edades_ninos', e.target.value)}
                                    />
                                    <InputError message={errors.edades_ninos} />
                                </div>
                            )}

                            <div className="space-y-2 md:col-span-2">
                                <Label>¿Todos en la familia están de acuerdo con la adopción? *</Label>
                                <RadioGroup 
                                    value={data.todos_acuerdo_adopcion} 
                                    onValueChange={(value) => setData('todos_acuerdo_adopcion', value)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="acuerdo_si" />
                                        <Label htmlFor="acuerdo_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="acuerdo_no" />
                                        <Label htmlFor="acuerdo_no">No</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.todos_acuerdo_adopcion} />
                            </div>
                        </FormSection>

                        {/* Experiencia con Mascotas */}
                        <FormSection title="🐾 Experiencia con Mascotas">
                            <div className="space-y-2">
                                <Label>¿Tiene otras mascotas actualmente? *</Label>
                                <RadioGroup 
                                    value={data.tiene_otras_mascotas} 
                                    onValueChange={(value) => setData('tiene_otras_mascotas', value)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="otras_si" />
                                        <Label htmlFor="otras_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="otras_no" />
                                        <Label htmlFor="otras_no">No</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.tiene_otras_mascotas} />
                            </div>

                            {tieneOtrasMascotas && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="otras_mascotas_detalles">Describe tus otras mascotas *</Label>
                                    <Textarea
                                        id="otras_mascotas_detalles"
                                        placeholder="Tipo, edad, sexo, si están esterilizadas, etc."
                                        value={data.otras_mascotas_detalles}
                                        onChange={(e) => setData('otras_mascotas_detalles', e.target.value)}
                                    />
                                    <InputError message={errors.otras_mascotas_detalles} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>¿Tuvo mascotas antes? *</Label>
                                <RadioGroup 
                                    value={data.tuvo_mascotas_antes} 
                                    onValueChange={(value) => setData('tuvo_mascotas_antes', value)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="si" id="tuvo_si" />
                                        <Label htmlFor="tuvo_si">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="tuvo_no" />
                                        <Label htmlFor="tuvo_no">No</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.tuvo_mascotas_antes} />
                            </div>

                            {data.tuvo_mascotas_antes === 'si' && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="que_paso_mascotas_anteriores">¿Qué pasó con las mascotas anteriores?</Label>
                                    <Textarea
                                        id="que_paso_mascotas_anteriores"
                                        placeholder="Cuéntanos qué ocurrió con tus mascotas anteriores..."
                                        value={data.que_paso_mascotas_anteriores}
                                        onChange={(e) => setData('que_paso_mascotas_anteriores', e.target.value)}
                                    />
                                    <InputError message={errors.que_paso_mascotas_anteriores} />
                                </div>
                            )}
                        </FormSection>

                        {/* Motivación */}
                        <FormSection title="💭 Motivación para Adoptar">
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="porque_adopta">¿Por qué quieres adoptar esta mascota? *</Label>
                                <Textarea
                                    id="porque_adopta"
                                    placeholder="Comparte tus motivaciones..."
                                    value={data.porque_adopta}
                                    onChange={(e) => setData('porque_adopta', e.target.value)}
                                    required
                                />
                                <InputError message={errors.porque_adopta} />
                            </div>

                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="que_espera_convivencia">¿Qué esperas de la convivencia con la mascota? *</Label>
                                <Textarea
                                    id="que_espera_convivencia"
                                    placeholder="Describe qué esperas de vivir con tu nueva mascota..."
                                    value={data.que_espera_convivencia}
                                    onChange={(e) => setData('que_espera_convivencia', e.target.value)}
                                    required
                                />
                                <InputError message={errors.que_espera_convivencia} />
                            </div>

                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="que_haria_problemas_comportamiento">¿Qué harías ante problemas de comportamiento? *</Label>
                                <Textarea
                                    id="que_haria_problemas_comportamiento"
                                    placeholder="Explica cómo manejarías problemas de comportamiento..."
                                    value={data.que_haria_problemas_comportamiento}
                                    onChange={(e) => setData('que_haria_problemas_comportamiento', e.target.value)}
                                    required
                                />
                                <InputError message={errors.que_haria_problemas_comportamiento} />
                            </div>

                            <div className="space-y-2">
                                <Label>¿Aceptas visitas de seguimiento? *</Label>
                                <RadioGroup 
                                    value={data.acepta_visitas_seguimiento} 
                                    onValueChange={(value) => setData('acepta_visitas_seguimiento', value)}
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
                                <InputError message={errors.acepta_visitas_seguimiento} />
                            </div>
                        </FormSection>

                        {/* Compromisos */}
                        <FormSection title="📝 Compromisos de Adopción">
                            <div className="space-y-4 md:col-span-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="acepta_proceso_evaluacion"
                                        checked={data.acepta_proceso_evaluacion}
                                        onCheckedChange={(checked) => setData('acepta_proceso_evaluacion', checked as boolean)}
                                    />
                                    <Label htmlFor="acepta_proceso_evaluacion" className="text-sm">
                                        Acepto someterme al proceso de evaluación y entrevista *
                                    </Label>
                                </div>
                                <InputError message={errors.acepta_proceso_evaluacion} />

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="acepta_cuidado_responsable"
                                        checked={data.acepta_cuidado_responsable}
                                        onCheckedChange={(checked) => setData('acepta_cuidado_responsable', checked as boolean)}
                                    />
                                    <Label htmlFor="acepta_cuidado_responsable" className="text-sm">
                                        Me comprometo a brindar cuidado responsable, alimentación, atención veterinaria y amor *
                                    </Label>
                                </div>
                                <InputError message={errors.acepta_cuidado_responsable} />

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="acepta_contrato_adopcion"
                                        checked={data.acepta_contrato_adopcion}
                                        onCheckedChange={(checked) => setData('acepta_contrato_adopcion', checked as boolean)}
                                    />
                                    <Label htmlFor="acepta_contrato_adopcion" className="text-sm">
                                        Acepto firmar un contrato de adopción responsable *
                                    </Label>
                                </div>
                                <InputError message={errors.acepta_contrato_adopcion} />
                            </div>
                        </FormSection>

                        {/* Botones */}
                        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
                            >
                                {processing ? 'Enviando...' : 'Enviar Solicitud de Adopción'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
