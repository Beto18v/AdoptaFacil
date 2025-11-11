# faqs.py
# Base de datos de preguntas frecuentes (FAQs) y sus respuestas para el chatbot.
# Aquí se agregan, editan y organizan las preguntas, respuestas y palabras clave.
# No contiene lógica de búsqueda, solo los datos.

# FAQ Data Structure for AdoptaFácil Chatbot

# This file contains structured FAQs extracted from the platform documentation
# Each FAQ has a question, answer, and optional keywords for better matching

FAQS = [
    # General Platform Questions
    {
        "question": "¿Qué es AdoptaFácil?",
        "answer": "AdoptaFácil es una plataforma integral diseñada para revolucionar el proceso de adopción de mascotas en Colombia. Combina tecnologías modernas con un enfoque centrado en el bienestar animal, conectando adoptantes, dueños de mascotas, refugios y aliados comerciales en un solo lugar.",
        "keywords": ["que es", "plataforma", "adoptafacil", "qué es", "que hace", "para que sirve"]
    },
    {
        "question": "¿Cómo funciona la plataforma?",
        "answer": "La plataforma conecta adoptantes con mascotas disponibles. Los usuarios pueden explorar el catálogo de mascotas, guardar favoritos, enviar solicitudes de adopción y hacer seguimiento en tiempo real del proceso.",
        "keywords": ["funciona", "como funciona", "proceso", "como usar", "como se usa"]
    },
    {
        "question": "¿Es gratuita la plataforma?",
        "answer": "Sí, el registro y uso básico de la plataforma es completamente gratuito. La adopción de mascotas no tiene costo, aunque se recomienda cubrir gastos de vacunación y esterilización.",
        "keywords": ["gratis", "costo", "precio", "pagar", "cuesta", "pago"]
    },
    {
        "question": "¿Qué puedo hacer en AdoptaFácil?",
        "answer": "En AdoptaFácil puedes adoptar mascotas, publicar mascotas para adopción, comprar productos para mascotas, donar a refugios, participar en la comunidad, compartir historias y consejos sobre mascotas.",
        "keywords": ["que puedo hacer", "funciones", "características", "opciones"]
    },
    {
        "question": "¿AdoptaFácil es seguro?",
        "answer": "Sí, AdoptaFácil prioriza la seguridad. Todas las cuentas requieren verificación de email, los procesos de adopción son estructurados, y tenemos políticas claras para proteger a las mascotas y usuarios.",
        "keywords": ["seguro", "seguridad", "confiable", "protección"]
    },

    # Registration and Users
    {
        "question": "¿Cómo me registro en la plataforma?",
        "answer": "El registro es simple: crea una cuenta con tu email, verifica tu correo electrónico y completa tu perfil. Hay diferentes tipos de cuenta según tu rol: adoptante, dueño de mascota, refugio o aliado comercial.",
        "keywords": ["registro", "registrar", "crear cuenta", "signup", "darme de alta", "unirme"]
    },
    {
        "question": "¿Qué tipos de usuario hay?",
        "answer": "Hay cuatro tipos principales: Adoptantes (personas que buscan mascota), Dueños de mascotas (que publican mascotas para adopción), Refugios/ONGs (organizaciones que publican múltiples mascotas) y Aliados comerciales (tiendas de productos para mascotas).",
        "keywords": ["tipos usuario", "roles", "cuentas", "perfiles"]
    },
    {
        "question": "¿Es obligatorio verificar el email?",
        "answer": "Sí, la verificación de email es obligatoria para todas las cuentas por seguridad y para poder recibir notificaciones importantes sobre adopciones y solicitudes.",
        "keywords": ["verificar email", "verificación", "correo", "confirmar email"]
    },
    {
        "question": "¿Puedo tener múltiples cuentas?",
        "answer": "No, cada persona puede tener solo una cuenta. Si representas un refugio o negocio, puedes actualizar tu perfil a la categoría correspondiente.",
        "keywords": ["múltiples cuentas", "varias cuentas", "distintas cuentas"]
    },
    {
        "question": "¿Cómo cambio mi tipo de cuenta?",
        "answer": "Para cambiar tu tipo de cuenta (por ejemplo, de adoptante a refugio), contacta al soporte con documentación que acredite tu rol. El equipo revisará y actualizará tu perfil.",
        "keywords": ["cambiar tipo cuenta", "actualizar perfil", "cambiar rol"]
    },

    # Pets Management
    {
        "question": "¿Cómo publicar una mascota para adopción?",
        "answer": "Para publicar una mascota: regístrate como dueño, ve al apartado 'Mis Mascotas', haz clic en 'Agregar Mascota' y completa el formulario con nombre, especie, edad, ubicación, descripción y hasta 3 fotos. La plataforma calcula automáticamente la edad.",
        "keywords": ["publicar mascota", "agregar mascota", "poner en adopción", "dar en adopción"]
    },
    {
        "question": "¿Qué información necesito para publicar una mascota?",
        "answer": "Necesitas: nombre de la mascota, especie (perro/gato/otro), raza, fecha de nacimiento (edad calculada automáticamente), sexo, ciudad de ubicación, descripción detallada y hasta 3 fotos de la mascota.",
        "keywords": ["información mascota", "datos necesarios", "requisitos publicación", "que necesito"]
    },
    {
        "question": "¿Puedo subir múltiples fotos de mi mascota?",
        "answer": "Sí, puedes subir hasta 3 fotos por mascota. Se recomienda incluir fotos desde diferentes ángulos y en diferentes poses para que los adoptantes puedan conocer mejor a la mascota.",
        "keywords": ["fotos", "imágenes", "múltiples fotos", "fotos mascota"]
    },
    {
        "question": "¿Cómo buscar mascotas para adoptar?",
        "answer": "Puedes explorar el catálogo público sin registrarte. Usa los filtros por especie, edad, ubicación y raza. También puedes guardar mascotas en favoritos una vez registrado.",
        "keywords": ["buscar mascota", "encontrar mascota", "catálogo", "ver mascotas"]
    },
    {
        "question": "¿Puedo editar la información de mi mascota?",
        "answer": "Sí, como dueño de la publicación puedes editar la información de tu mascota en cualquier momento desde 'Mis Mascotas'. Los cambios se reflejan inmediatamente en el catálogo.",
        "keywords": ["editar mascota", "modificar mascota", "cambiar información"]
    },
    {
        "question": "¿Cómo elimino una publicación de mascota?",
        "answer": "Puedes eliminar tu publicación desde 'Mis Mascotas'. Una vez eliminada, ya no aparecerá en el catálogo público. Si ya hay solicitudes activas, se cancelarán automáticamente.",
        "keywords": ["eliminar mascota", "borrar publicación", "quitar mascota"]
    },
    {
        "question": "¿Qué especies de mascotas puedo publicar?",
        "answer": "Puedes publicar perros, gatos y otras mascotas (conejos, aves, etc.). Cada publicación debe incluir información completa sobre la especie y características específicas.",
        "keywords": ["especies", "tipos mascotas", "animales", "perros", "gatos"]
    },

    # Adoption Process
    {
        "question": "¿Cuál es el proceso de adopción?",
        "answer": "1) Explora y encuentra una mascota, 2) Regístrate si no lo has hecho, 3) Envía solicitud de adopción con formulario, 4) El dueño evalúa tu solicitud, 5) Coordinan entrega, 6) ¡Adopción exitosa!",
        "keywords": ["proceso adopción", "como adoptar", "pasos adopción", "pasos"]
    },
    {
        "question": "¿Qué incluye el formulario de adopción?",
        "answer": "El formulario incluye preguntas sobre tu experiencia con mascotas, estilo de vida, espacio disponible, otras mascotas en casa, tiempo disponible para dedicar, y compromiso con el cuidado veterinario.",
        "keywords": ["formulario adopción", "preguntas adopción", "que preguntan"]
    },
    {
        "question": "¿Cuánto tiempo toma el proceso de adopción?",
        "answer": "El tiempo varía según el dueño de la mascota. Algunos procesos se completan en días, otros pueden tomar semanas. Puedes hacer seguimiento en tiempo real del estado de tu solicitud.",
        "keywords": ["tiempo adopción", "cuanto tarda", "duración", "cuanto tiempo"]
    },
    {
        "question": "¿Puedo adoptar si ya tengo otras mascotas?",
        "answer": "Sí, pero tus mascotas actuales deben estar vacunadas y socializadas. El dueño evaluará la compatibilidad entre tus mascotas y la que quieres adoptar.",
        "keywords": ["otra mascota", "ya tengo mascota", "compatibilidad", "mascotas existentes"]
    },
    {
        "question": "¿Cómo veo el estado de mi solicitud de adopción?",
        "answer": "En tu dashboard personal, ve a 'Mis Solicitudes' donde podrás ver el estado actualizado de todas tus solicitudes de adopción enviadas.",
        "keywords": ["estado solicitud", "seguimiento", "como va", "progreso"]
    },
    {
        "question": "¿Puedo cancelar una solicitud de adopción?",
        "answer": "Sí, puedes cancelar tu solicitud desde 'Mis Solicitudes'. El dueño de la mascota recibirá una notificación automática.",
        "keywords": ["cancelar solicitud", "retirar solicitud", "no quiero adoptar"]
    },
    {
        "question": "¿Qué pasa si mi solicitud es rechazada?",
        "answer": "Si tu solicitud es rechazada, recibirás una notificación con el motivo. Puedes enviar nuevas solicitudes a otras mascotas o contactar al dueño para más información.",
        "keywords": ["solicitud rechazada", "rechazaron", "no me aceptaron"]
    },

    # Requirements and Conditions
    {
        "question": "¿Cuáles son los requisitos para adoptar?",
        "answer": "Debes ser mayor de edad, completar el formulario de adopción honestamente, tener espacio adecuado para la mascota, compromiso con vacunas y cuidado veterinario, y estar dispuesto a proporcionar un hogar amoroso y responsable.",
        "keywords": ["requisitos adopción", "necesito para adoptar", "condiciones", "requisitos"]
    },
    {
        "question": "¿Las mascotas se entregan vacunadas?",
        "answer": "Sí, todas las mascotas se entregan con el esquema de vacunación al día según su edad. También se entregan esterilizadas cuando corresponde.",
        "keywords": ["vacunas", "vacunación", "esterilización", "vacunas al día"]
    },
    {
        "question": "¿Cuánto cuesta adoptar una mascota?",
        "answer": "La adopción en sí no tiene costo. Sin embargo, se recomienda cubrir gastos de vacunación, desparasitación y esterilización si no están incluidos. Algunos refugios pueden tener tarifas simbólicas.",
        "keywords": ["costo adopción", "precio adopción", "pagar adopción", "cuesta adoptar"]
    },
    {
        "question": "¿Qué edad mínima necesito para adoptar?",
        "answer": "Debes ser mayor de edad (18 años) para adoptar una mascota. Los menores pueden participar en el proceso con un adulto responsable.",
        "keywords": ["edad mínima", "mayor de edad", "edad para adoptar"]
    },
    {
        "question": "¿Necesito tener jardín para adoptar?",
        "answer": "No necesariamente. Muchas mascotas se adaptan perfectamente a espacios pequeños. Lo importante es proporcionar ejercicio diario, cariño y atención veterinaria.",
        "keywords": ["jardín", "espacio", "departamento", "apartamento"]
    },

    # Community and Social Features
    {
        "question": "¿Qué es la comunidad de AdoptaFácil?",
        "answer": "Es una red social especializada donde usuarios comparten historias de adopción, consejos sobre cuidado de mascotas, preguntas a la comunidad, noticias y eventos relacionados con el bienestar animal.",
        "keywords": ["comunidad", "red social", "foro", "social"]
    },
    {
        "question": "¿Puedo compartir mi historia de adopción?",
        "answer": "¡Claro! En la sección Comunidad puedes publicar historias de adopción exitosa, consejos de cuidado, preguntas a otros usuarios, noticias sobre mascotas o eventos relacionados.",
        "keywords": ["historia adopción", "compartir experiencia", "publicar", "contar historia"]
    },
    {
        "question": "¿Cómo publico en la comunidad?",
        "answer": "En la sección Comunidad, haz clic en 'Crear Publicación' y elige el tipo: historia, consejo, pregunta, noticia o evento. Agrega texto, fotos y etiquetas relevantes.",
        "keywords": ["publicar comunidad", "crear publicación", "compartir"]
    },
    {
        "question": "¿Puedo hacer preguntas a la comunidad?",
        "answer": "Sí, puedes publicar preguntas específicas sobre cuidado de mascotas, alimentación, entrenamiento, salud, etc. La comunidad responderá con consejos basados en experiencias reales.",
        "keywords": ["preguntas comunidad", "consultar", "dudas", "ayuda comunidad"]
    },

    # Products and Marketplace
    {
        "question": "¿Cómo funciona el marketplace de productos?",
        "answer": "Aliados comerciales pueden publicar productos para mascotas (comida, juguetes, accesorios). Los usuarios pueden explorar el catálogo, contactar a los vendedores y realizar compras.",
        "keywords": ["productos", "marketplace", "comprar", "tienda"]
    },
    {
        "question": "¿Puedo vender productos en la plataforma?",
        "answer": "Sí, como aliado comercial puedes registrarte, publicar productos con fotos, descripciones y precios, y gestionar tu inventario desde un dashboard unificado.",
        "keywords": ["vender productos", "aliado comercial", "tienda", "vendedor"]
    },
    {
        "question": "¿Qué tipos de productos puedo encontrar?",
        "answer": "Encontrarás comida, juguetes, camas, accesorios, productos de higiene, medicamentos veterinarios, y todo lo necesario para el cuidado de mascotas.",
        "keywords": ["tipos productos", "que venden", "productos disponibles"]
    },
    {
        "question": "¿Cómo contacto a un vendedor?",
        "answer": "Desde la página del producto, puedes enviar un mensaje directo al vendedor a través de la plataforma. También puedes ver su información de contacto y ubicación.",
        "keywords": ["contactar vendedor", "hablar con vendedor", "mensaje vendedor"]
    },

    # Donations
    {
        "question": "¿Cómo puedo donar a refugios?",
        "answer": "Puedes donar directamente a refugios específicos a través de la plataforma usando diferentes métodos de pago. Las donaciones van directamente al refugio elegido.",
        "keywords": ["donar", "donaciones", "apoyar refugio", "ayudar refugios"]
    },
    {
        "question": "¿Las donaciones son seguras?",
        "answer": "Sí, usamos pasarelas de pago seguras y certificadas. Recibirás recibos automáticos de todas tus donaciones.",
        "keywords": ["donaciones seguras", "pagos seguros", "seguridad", "confiable"]
    },
    {
        "question": "¿Qué tipos de donaciones aceptan?",
        "answer": "Los refugios aceptan donaciones económicas, alimentos, medicamentos, productos de higiene, juguetes, y tiempo como voluntario. Cada refugio especifica sus necesidades.",
        "keywords": ["tipos donaciones", "que donar", "donaciones aceptadas"]
    },
    {
        "question": "¿Puedo donar en especie?",
        "answer": "Sí, muchos refugios aceptan donaciones en especie como alimentos, medicamentos, productos de limpieza, juguetes y suministros veterinarios. Contacta directamente al refugio.",
        "keywords": ["donar en especie", "donaciones físicas", "productos"]
    },

    # Technical and Support
    {
        "question": "¿Cómo recupero mi contraseña?",
        "answer": "En la página de login, haz clic en '¿Olvidaste tu contraseña?', ingresa tu email y sigue las instrucciones enviadas por correo para restablecerla.",
        "keywords": ["recuperar contraseña", "olvidé contraseña", "reset password", "cambiar contraseña"]
    },
    {
        "question": "¿Dónde encuentro ayuda o soporte?",
        "answer": "Puedes usar este chatbot para preguntas frecuentes, revisar la documentación en la plataforma, o contactar al soporte a través de los canales oficiales.",
        "keywords": ["ayuda", "soporte", "contacto", "ayuda técnica"]
    },
    {
        "question": "¿La plataforma está disponible en móvil?",
        "answer": "Actualmente es una aplicación web responsive. Próximamente estará disponible la API para aplicación móvil nativa.",
        "keywords": ["móvil", "app", "celular", "aplicación móvil"]
    },
    {
        "question": "¿Cómo reporto un problema?",
        "answer": "Puedes reportar problemas técnicos o contenido inapropiado usando el botón 'Reportar' en las publicaciones, o contactando al soporte con detalles del issue.",
        "keywords": ["reportar problema", "problema", "error", "bug"]
    },
    {
        "question": "¿Cómo contacto al soporte técnico?",
        "answer": "Envía un email a soporte@adoptafacil.com o usa el formulario de contacto en la plataforma. Incluye detalles del problema y capturas de pantalla si es posible.",
        "keywords": ["contacto soporte", "soporte técnico", "ayuda técnica"]
    },

    # Location and Availability
    {
        "question": "¿En qué ciudades está disponible?",
        "answer": "La plataforma está disponible en toda Colombia. Puedes buscar mascotas por ciudad y usar la función de geolocalización para encontrar refugios cercanos.",
        "keywords": ["ciudades", "ubicación", "disponible", "dónde funciona"]
    },
    {
        "question": "¿Cómo encuentro refugios cerca de mí?",
        "answer": "Regístrate en la plataforma, ve al apartado de mapa y filtra por ubicación. También puedes buscar mascotas por ciudad en el catálogo.",
        "keywords": ["refugios cercanos", "mapa", "ubicación", "cerca de mí"]
    },
    {
        "question": "¿Hay refugios en mi ciudad?",
        "answer": "Usa el mapa interactivo de la plataforma para ver refugios registrados en tu ciudad. Si no encuentras ninguno, puedes contactar a organizaciones locales de bienestar animal.",
        "keywords": ["refugios ciudad", "refugios locales", "en mi ciudad"]
    },

    # Volunteering and Help
    {
        "question": "¿Cómo puedo ser voluntario?",
        "answer": "Puedes unirte como voluntario contactando directamente a refugios a través de la plataforma. Participa en actividades de cuidado, rescate, eventos y apoyo general.",
        "keywords": ["voluntario", "ayudar", "colaborar", "voluntariado"]
    },
    {
        "question": "¿Qué tipos de ayuda necesitan los refugios?",
        "answer": "Los refugios necesitan voluntarios para cuidado de mascotas, rescates, eventos, difusión, donaciones económicas, alimentos, medicamentos y suministros veterinarios.",
        "keywords": ["ayuda refugios", "necesidades", "apoyo", "que necesitan"]
    },
    {
        "question": "¿Puedo ayudar de otras formas?",
        "answer": "Además de voluntariado y donaciones, puedes ayudar difundiendo la plataforma, compartiendo historias positivas, educando sobre adopción responsable, y reportando maltrato animal.",
        "keywords": ["otras formas ayudar", "ayudar más", "colaborar", "apoyo adicional"]
    },

    # Additional Common Questions
    {
        "question": "¿Qué pasa si no puedo cuidar más a mi mascota?",
        "answer": "Si ya no puedes cuidar a tu mascota, por favor no la abandones. Contacta a refugios locales o usa AdoptaFácil para encontrarle un nuevo hogar responsable. Nunca dejes mascotas en la calle.",
        "keywords": ["no puedo cuidar", "devolver mascota", "regresar mascota", "problemas cuidado"]
    },
    {
        "question": "¿Cómo sé si una mascota es para mí?",
        "answer": "Considera tu estilo de vida, espacio disponible, tiempo para dedicar, experiencia previa, y si tienes otras mascotas. Cada mascota tiene personalidad única - lee las descripciones detalladas.",
        "keywords": ["mascota para mí", "que mascota elegir", "cual adoptar"]
    },
    {
        "question": "¿Las mascotas tienen chip de identificación?",
        "answer": "Muchas mascotas publicadas ya tienen chip de identificación. Si no lo tienen, se recomienda colocarlo después de la adopción para mayor seguridad.",
        "keywords": ["chip identificación", "chip", "identificación", "microchip"]
    },
    {
        "question": "¿Puedo visitar al refugio antes de adoptar?",
        "answer": "¡Absolutamente! Se recomienda visitar el refugio o dueño de la mascota para conocer mejor al animal, las instalaciones y hacer preguntas específicas sobre su personalidad y cuidados.",
        "keywords": ["visitar refugio", "conocer mascota", "ver en persona"]
    },
    {
        "question": "¿Qué incluye el contrato de adopción?",
        "answer": "El contrato incluye compromiso de cuidado veterinario, esterilización si corresponde, no abandono, y condiciones específicas del refugio o dueño sobre visitas de seguimiento.",
        "keywords": ["contrato adopción", "acuerdo", "compromisos", "obligaciones"]
    },
    {
        "question": "¿Puedo cambiar de opinión después de adoptar?",
        "answer": "La adopción es un compromiso serio. Si surgen problemas, contacta al refugio original - ellos pueden ayudar con readopción responsable. Nunca abandones a una mascota.",
        "keywords": ["cambiar opinión", "arrepentirme", "problemas adopción"]
    },
    {
        "question": "¿Cómo cuido a mi nueva mascota?",
        "answer": "Cada mascota tiene necesidades específicas. Pregunta al dueño/refugio sobre alimentación, rutinas, veterinarios cercanos. Únete a la comunidad de AdoptaFácil para consejos de otros adoptantes.",
        "keywords": ["cuidar mascota", "cuidados", "alimentación", "rutina"]
    },
    {
        "question": "¿Dónde encuentro veterinarios?",
        "answer": "Pregunta al refugio por veterinarios recomendados. También puedes buscar en directorios locales o usar apps de geolocalización para encontrar clínicas veterinarias certificadas.",
        "keywords": ["veterinarios", "médico mascotas", "clínica veterinaria"]
    },
    {
        "question": "¿Qué vacunas necesita mi mascota?",
        "answer": "Las vacunas varían por especie y edad. Los refugios suelen proporcionar el esquema completo. Consulta con un veterinario para el plan de vacunación específico de tu mascota.",
        "keywords": ["vacunas necesarias", "esquema vacunación", "vacunas obligatorias"]
    },
    {
        "question": "¿Cómo socializo a mi nueva mascota?",
        "answer": "La socialización toma tiempo y paciencia. Empieza con paseos cortos, presentaciones graduales a otros animales/personas, y refuerza comportamientos positivos con premios y cariño.",
        "keywords": ["socializar mascota", "adaptación", "nueva mascota", "acostumbrar"]
    },
    {
        "question": "¿Cuánto cuesta mantener una mascota?",
        "answer": "Los costos incluyen comida ($50.000-200.000/mes), veterinario ($100.000-500.000/año), accesorios, y emergencias. Planifica un presupuesto realista antes de adoptar.",
        "keywords": ["costos mantenimiento", "gastos mascota", "presupuesto", "cuanto cuesta mantener"]
    },
    {
        "question": "¿Puedo viajar con mi mascota?",
        "answer": "Sí, pero verifica requisitos de transporte, documentación necesaria (carnet sanitario), y políticas de alojamientos. Algunos viajes requieren permisos especiales.",
        "keywords": ["viajar con mascota", "transporte mascota", "vacaciones"]
    },
    {
        "question": "¿Qué hago en caso de emergencia veterinaria?",
        "answer": "Guarda números de veterinarios 24 horas, clínicas de urgencias, y conoce el camino. Ten a mano el teléfono del refugio que entregó la mascota por si necesitan intervenir.",
        "keywords": ["emergencia veterinaria", "urgencia", "accidente", "enfermedad"]
    },
    {
        "question": "¿Cómo reporto maltrato animal?",
        "answer": "Contacta a las autoridades locales (policía ambiental), organizaciones de bienestar animal, o usa líneas de denuncia. En AdoptaFácil puedes reportar publicaciones sospechosas.",
        "keywords": ["maltrato animal", "denunciar", "reportar abuso", "animal maltratado"]
    },
    {
        "question": "¿Puedo adoptar más de una mascota?",
        "answer": "Sí, pero evalúa si puedes proporcionar cuidado adecuado a múltiples mascotas. Considera compatibilidad, espacio, tiempo y recursos económicos antes de adoptar varias.",
        "keywords": ["múltiples mascotas", "adoptar varias", "más de una"]
    },
    {
        "question": "¿Qué raza de perro/gato debo elegir?",
        "answer": "No elijas por raza, sino por personalidad y compatibilidad con tu estilo de vida. Todas las razas pueden ser mascotas maravillosas si reciben el cuidado adecuado.",
        "keywords": ["que raza elegir", "mejor raza", "raza recomendada"]
    },
    {
        "question": "¿Las mascotas de refugio son agresivas?",
        "answer": "No, la mayoría de las mascotas en refugios son víctimas de abandono, no de comportamiento agresivo. Con paciencia y socialización adecuada, se convierten en compañeros maravillosos.",
        "keywords": ["mascotas agresivas", "miedo refugios", "mascotas peligrosas"]
    },
    {
        "question": "¿Cómo preparo mi casa para una nueva mascota?",
        "answer": "Prepara un espacio seguro con comida, agua, cama, juguetes y accesorios. Mascota puntos peligrosos (productos químicos, cables), y establece rutinas desde el primer día.",
        "keywords": ["preparar casa", "llegada mascota", "antes de adoptar"]
    },
    {
        "question": "¿Puedo adoptar si vivo en apartamento?",
        "answer": "Sí, muchas mascotas se adaptan perfectamente a apartamentos. Lo importante es proporcionar ejercicio diario, estimulación mental y visitas veterinarias regulares.",
        "keywords": ["apartamento", "edificio", "espacio pequeño"]
    },
    {
        "question": "¿Qué edad es ideal para adoptar?",
        "answer": "No hay edad ideal - depende de tu situación. Adultos jóvenes (1-3 años) son más predecibles, pero cachorros y adultos mayores también necesitan hogares amorosos.",
        "keywords": ["edad ideal", "cachorro o adulto", "que edad adoptar"]
    },
    {
        "question": "¿Cómo sé si mi mascota está sana?",
        "answer": "Observa energía, apetito, ojos brillantes, pelaje saludable. Lleva a chequeos veterinarios regulares. Los refugios suelen proporcionar historial médico básico.",
        "keywords": ["mascota sana", "salud mascota", "signos salud"]
    },
    {
        "question": "¿Puedo entrenar a mi mascota?",
        "answer": "¡Sí! El entrenamiento positivo con refuerzo funciona para perros y gatos. Usa premios, paciencia y consistencia. Hay muchos recursos gratuitos en la comunidad de AdoptaFácil.",
        "keywords": ["entrenar mascota", "adiestramiento", "enseñar trucos"]
    },
    {
        "question": "¿Qué hago si mi mascota se enferma?",
        "answer": "Llévala inmediatamente al veterinario. Monitorea síntomas, dieta y comportamiento. Prevenir es mejor que curar - mantén al día las vacunas y desparasitaciones.",
        "keywords": ["mascota enferma", "enfermedad", "síntomas", "que hacer si enferma"]
    },
    {
        "question": "¿Dónde puedo aprender más sobre mascotas?",
        "answer": "Únete a la comunidad de AdoptaFácil, sigue blogs especializados, consulta libros sobre cuidado animal, y asiste a talleres de organizaciones de bienestar animal.",
        "keywords": ["aprender mascotas", "educación", "conocimientos", "cursos"]
    }
]

# Function to get all questions for fuzzy matching
def get_all_questions() -> list[str]:
    return [str(faq["question"]) for faq in FAQS]

# Function to find FAQ by question
def find_faq_by_question(question: str) -> dict[str, str | list[str]] | None:
    for faq in FAQS:
        if faq["question"].lower() == question.lower():
            return faq
    return None

# Function to search FAQs by keywords
def search_faqs_by_keywords(query: str) -> list[dict[str, str | list[str]]]:
    results = []
    query_lower = query.lower()
    for faq in FAQS:
        if any(keyword.lower() in query_lower for keyword in faq.get("keywords", [])):
            results.append(faq)
    return results