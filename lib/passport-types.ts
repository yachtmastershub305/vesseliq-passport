export type PassportMeta = {
  note: string;
  schema_version: string;
  passport_id: string;
  issued: string;
  is_sample?: boolean;
};

export type Vessel = {
  vessel_id: string;
  catalog_id: string;
  hin: string;
  imo_number: string | null;
  mmsi: string | null;
  official_number_us: string | null;
  name: string;
  flag_state: string | null;
  builder: string;
  make: string;
  model: string;
  model_year: number;
  loa_m: number;
  beam_m: number;
  draft_m: number;
  depth_m: number;
  hull_material: string | null;
  vessel_type: string;
  classification_society: string | null;
  verification_status: "verified" | "pending" | "unverified" | string;
  confidence_pct: number;
  service_status: string | null;
  service_status_detail: string | null;
  documented: string | null;
  doc_status: string | null;
  doc_type: string | null;
  doc_issued_date: string | null;
  doc_expiration_date: string | null;
  manufacturer_mic: string | null;
  manufacturer_id: string | null;
  created_at: string;
  updated_at: string;
  attributes: Record<string, unknown>;
};

export type Manufacturer = {
  mic: string;
  company_name: string;
  display_name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  mic_status: string;
};

export type EquipmentModel = {
  manufacturer: string;
  model_number: string;
  equipment_type: string;
  specs: Record<string, string | number | boolean | null>;
};

export type EquipmentInstance = {
  equipment_instance_id: string;
  serial_number: string;
  installed_at: string;
  removed_at: string | null;
  subsystem_node_id: string;
  attributes: Record<string, string | number | boolean | null>;
  model: EquipmentModel;
};

export type SystemRecord = {
  system_id: string;
  system_type: "PROPULSION" | "ELECTRICAL" | "NAVIGATION" | string;
  name: string;
  attributes: Record<string, unknown>;
  equipment: EquipmentInstance[];
};

export type ServiceLineItem = {
  part_number: string;
  description: string;
  quantity: number;
  unit_cost: number;
  currency_code: string;
  total_cost: number;
};

export type ServiceEvent = {
  service_event_id: string;
  event_date: string;
  event_type: string;
  meter_reading_hrs: number | null;
  work_order_ref: string;
  performed_by: string;
  task_code: string;
  equipment_instance_id: string | null;
  notes: string;
  line_items: ServiceLineItem[];
};

export type ProvenanceRecord = {
  provenance_id: string;
  entity: "vessel" | "equipment_instance" | "service_event" | "manufacturers" | string;
  source_name: string;
  source_type: "government_registry" | "oem_data" | "user_submission" | string;
  source_uri: string | null;
  source_url: string | null;
  license: string;
  captured_at: string;
  captured_by: string;
  payload_summary: string;
};

export type ScoringBreakdown = {
  identity: number;
  equipment: number;
  maintenance: number;
  provenance: number;
  documents: number;
};

export type Scoring = {
  confidence_pct: number;
  weights: {
    accuracy: number;
    provenance: number;
    completeness: number;
    consistency: number;
    timeliness: number;
  };
  breakdown: ScoringBreakdown;
};

export type Passport = {
  _meta: PassportMeta;
  vessel: Vessel;
  manufacturer: Manufacturer;
  systems: SystemRecord[];
  service_events: ServiceEvent[];
  provenance: ProvenanceRecord[];
  scoring: Scoring;
};
