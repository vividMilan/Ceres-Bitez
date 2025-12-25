import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://gzrudyxglpqmlecnectq.supabase.co",
    "sb_publishable_4fZvEvfzLLhOtPuw6PSafQ_aAfcn2nx", {
        auth: {
            storage: AsyncStorage,
            detectSessionInUrl: false
        }
    }
)
