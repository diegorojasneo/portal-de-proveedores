const fetchFeedbackSurveys = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }