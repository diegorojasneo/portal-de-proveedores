import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if both URL and key are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabase);

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export interface Database {
  public: {
    Tables: {
      // Portal users table for additional user info
      portal_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          role: 'proveedor' | 'aprobador' | 'operaciones';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          role: 'proveedor' | 'aprobador' | 'operaciones';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'proveedor' | 'aprobador' | 'operaciones';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ✅ TABLA REAL: proveedores
      proveedores: {
        Row: {
          id: string;
          email_login: string | null;
          password_hash: string | null;
          ruc: string;
          razon_social: string;
          nombre_comercial: string | null;
          tipo_persona: 'natural' | 'juridica';
          pais: string;
          direccion: string;
          tipo_comprobante_a_emitir: 'factura' | 'boleta' | 'recibo' | 'otro';
          ficha_ruc_url: string | null;
          persona_contacto: string | null;
          email_contacto: string;
          telefono_contacto: string | null;
          correo_neo_solicitante: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email_login?: string | null;
          password_hash?: string | null;
          ruc: string;
          razon_social: string;
          nombre_comercial?: string | null;
          tipo_persona: 'natural' | 'juridica';
          pais: string;
          direccion: string;
          tipo_comprobante_a_emitir: 'factura' | 'boleta' | 'recibo' | 'otro';
          ficha_ruc_url?: string | null;
          persona_contacto?: string | null;
          email_contacto: string;
          telefono_contacto?: string | null;
          correo_neo_solicitante?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email_login?: string | null;
          password_hash?: string | null;
          ruc?: string;
          razon_social?: string;
          nombre_comercial?: string | null;
          tipo_persona?: 'natural' | 'juridica';
          pais?: string;
          direccion?: string;
          tipo_comprobante_a_emitir?: 'factura' | 'boleta' | 'recibo' | 'otro';
          ficha_ruc_url?: string | null;
          persona_contacto?: string | null;
          email_contacto?: string;
          telefono_contacto?: string | null;
          correo_neo_solicitante?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // ✅ TABLA REAL: proveedor_cuentas_bancarias
      proveedor_cuentas_bancarias: {
        Row: {
          id: string;
          proveedor_id: string;
          moneda: 'PEN' | 'USD';
          banco: string;
          numero_cuenta: string;
          tipo_cuenta: string;
          cci: string | null;
          es_principal: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proveedor_id: string;
          moneda: 'PEN' | 'USD';
          banco: string;
          numero_cuenta: string;
          tipo_cuenta: string;
          cci?: string | null;
          es_principal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          proveedor_id?: string;
          moneda?: 'PEN' | 'USD';
          banco?: string;
          numero_cuenta?: string;
          tipo_cuenta?: string;
          cci?: string | null;
          es_principal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ✅ TABLA REAL: comprobantes
      comprobantes: {
        Row: {
          id: string;
          proveedor_id: string;
          tipo_documento: 'factura' | 'boleta' | 'recibo' | 'otro';
          numero_documento: string;
          monto: number;
          moneda: 'PEN' | 'USD';
          tiene_detraccion: boolean;
          aprobador_email: string;
          servicio_realizado: string | null;
          comprobante_pdf_url: string | null;
          status: 'pendiente' | 'aprobado' | 'rechazado';
          fecha_registro: string;
          approved_at: string | null;
          rejected_at: string | null;
          aprobado_por: string | null;
          motivo_rechazo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proveedor_id: string;
          tipo_documento: 'factura' | 'boleta' | 'recibo' | 'otro';
          numero_documento: string;
          monto: number;
          moneda: 'PEN' | 'USD';
          tiene_detraccion?: boolean;
          aprobador_email: string;
          servicio_realizado?: string | null;
          comprobante_pdf_url?: string | null;
          status?: 'pendiente' | 'aprobado' | 'rechazado';
          fecha_registro?: string;
          approved_at?: string | null;
          rejected_at?: string | null;
          aprobado_por?: string | null;
          motivo_rechazo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          proveedor_id?: string;
          tipo_documento?: 'factura' | 'boleta' | 'recibo' | 'otro';
          numero_documento?: string;
          monto?: number;
          moneda?: 'PEN' | 'USD';
          tiene_detraccion?: boolean;
          aprobador_email?: string;
          servicio_realizado?: string | null;
          comprobante_pdf_url?: string | null;
          status?: 'pendiente' | 'aprobado' | 'rechazado';
          fecha_registro?: string;
          approved_at?: string | null;
          rejected_at?: string | null;
          aprobado_por?: string | null;
          motivo_rechazo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ✅ TABLA REAL: pagos
      pagos: {
        Row: {
          id: string;
          comprobante_id: string;
          monto: number;
          moneda: 'PEN' | 'USD';
          estado_pago: 'pendiente' | 'programado' | 'pagado' | 'observado';
          metodo_pago: 'transferencia' | 'yape_plin' | 'cheque' | 'otro' | null;
          fecha_estimada_pago: string | null;
          fecha_pago: string | null;
          cuenta_bancaria_id: string | null;
          notas: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          comprobante_id: string;
          monto: number;
          moneda: 'PEN' | 'USD';
          estado_pago?: 'pendiente' | 'programado' | 'pagado' | 'observado';
          metodo_pago?: 'transferencia' | 'yape_plin' | 'cheque' | 'otro' | null;
          fecha_estimada_pago?: string | null;
          fecha_pago?: string | null;
          cuenta_bancaria_id?: string | null;
          notas?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          comprobante_id?: string;
          monto?: number;
          moneda?: 'PEN' | 'USD';
          estado_pago?: 'pendiente' | 'programado' | 'pagado' | 'observado';
          metodo_pago?: 'transferencia' | 'yape_plin' | 'cheque' | 'otro' | null;
          fecha_estimada_pago?: string | null;
          fecha_pago?: string | null;
          cuenta_bancaria_id?: string | null;
          notas?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ✅ TABLA REAL: documentos_operaciones
      documentos_operaciones: {
        Row: {
          id: string;
          titulo: string;
          tipo: 'contrato' | 'orden_compra' | 'acuerdo_confidencialidad' | 'manual_guia' | 'otro';
          descripcion: string | null;
          archivo_url: string;
          fecha_publicacion: string;
          is_active: boolean;
          audiencia_todos: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          tipo: 'contrato' | 'orden_compra' | 'acuerdo_confidencialidad' | 'manual_guia' | 'otro';
          descripcion?: string | null;
          archivo_url: string;
          fecha_publicacion?: string;
          is_active?: boolean;
          audiencia_todos?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          tipo?: 'contrato' | 'orden_compra' | 'acuerdo_confidencialidad' | 'manual_guia' | 'otro';
          descripcion?: string | null;
          archivo_url?: string;
          fecha_publicacion?: string;
          is_active?: boolean;
          audiencia_todos?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: comunicados
      comunicados: {
        Row: {
          id: string;
          titulo: string;
          tipo: 'general' | 'operativo' | 'financiero' | 'otro';
          contenido: string;
          fecha_publicacion: string;
          urgente: boolean;
          audiencia_todos: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          tipo?: 'general' | 'operativo' | 'financiero' | 'otro';
          contenido: string;
          fecha_publicacion?: string;
          urgente?: boolean;
          audiencia_todos?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          tipo?: 'general' | 'operativo' | 'financiero' | 'otro';
          contenido?: string;
          fecha_publicacion?: string;
          urgente?: boolean;
          audiencia_todos?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: encuestas_feedback
      encuestas_feedback: {
        Row: {
          id: string;
          proveedor_id: string;
          comunicacion: number;
          puntualidad_pagos: number;
          facilidad_portal: number;
          satisfaccion_general: number;
          comentarios: string | null;
          sugerencias: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          proveedor_id: string;
          comunicacion: number;
          puntualidad_pagos: number;
          facilidad_portal: number;
          satisfaccion_general: number;
          comentarios?: string | null;
          sugerencias?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          proveedor_id?: string;
          comunicacion?: number;
          puntualidad_pagos?: number;
          facilidad_portal?: number;
          satisfaccion_general?: number;
          comentarios?: string | null;
          sugerencias?: string | null;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: usuarios_operaciones
      usuarios_operaciones: {
        Row: {
          id: string;
          email: string;
          nombre_completo: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          nombre_completo?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre_completo?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: directorio_aprobadores
      directorio_aprobadores: {
        Row: {
          id: string;
          email_aprobador: string;
          nombre_aprobador: string | null;
          area: string | null;
          is_active: boolean;
          created_at: string;
          email_login: string | null;
          password_hash: string | null;
        };
        Insert: {
          id?: string;
          email_aprobador: string;
          nombre_aprobador?: string | null;
          area?: string | null;
          is_active?: boolean;
          created_at?: string;
          email_login?: string | null;
          password_hash?: string | null;
        };
        Update: {
          id?: string;
          email_aprobador?: string;
          nombre_aprobador?: string | null;
          area?: string | null;
          is_active?: boolean;
          created_at?: string;
          email_login?: string | null;
          password_hash?: string | null;
        };
      };
    };
    Views: {
      // ✅ VISTA REAL: v_dashboard_proveedor
      v_dashboard_proveedor: {
        Row: {
          proveedor_id: string | null;
          razon_social: string | null;
          comprobantes_registrados: number | null;
          comprobantes_aprobados: number | null;
          comprobantes_pendientes: number | null;
          comprobantes_rechazados: number | null;
          pagos_recibidos: number | null;
          monto_total_pagado: number | null;
        };
      };
      
      // ✅ VISTA REAL: v_dashboard_operaciones
      v_dashboard_operaciones: {
        Row: {
          total_comprobantes: number | null;
          total_aprobados: number | null;
          total_pendientes: number | null;
          total_rechazados: number | null;
          pagos_realizados: number | null;
          monto_pagado: number | null;
        };
      };

      // ✅ VISTA REAL: v_bandeja_aprobador
      v_bandeja_aprobador: {
        Row: {
          comprobante_id: string | null;
          proveedor: string | null;
          numero_documento: string | null;
          monto: number | null;
          moneda: 'PEN' | 'USD' | null;
          tipo_documento: 'factura' | 'boleta' | 'recibo' | 'otro' | null;
          servicio_realizado: string | null;
          fecha_registro: string | null;
          aprobador_email: string | null;
          status: 'pendiente' | 'aprobado' | 'rechazado' | null;
        };
      };

      // ✅ VISTA REAL: v_cola_pagos_operaciones
      v_cola_pagos_operaciones: {
        Row: {
          comprobante_id: string | null;
          proveedor: string | null;
          numero_documento: string | null;
          monto: number | null;
          moneda: 'PEN' | 'USD' | null;
          approved_at: string | null;
          tiene_detraccion: boolean | null;
          total_pagado_o_programado: number | null;
        };
      };
    };
  };
}