-- ============================================================================
-- Enable Supabase Realtime so mobilisation responses stream live to all clients.
-- Run this in the Supabase SQL Editor after 0001_init.sql.
-- ============================================================================
alter publication supabase_realtime add table mobilization_responses;
