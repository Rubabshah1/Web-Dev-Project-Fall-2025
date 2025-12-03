// import { supabase } from '../integrations/supabaseClient.js';

// export const signUp = async (req, res) => {
//   try {
//     const { email, password, name } = req.body;

//     const { data, error } = await supabase.auth.admin.createUser({
//       email,
//       password,
//       user_metadata: { name }
//     });

//     if (error) throw error;

//     res.json({ success: true, data: data.user });
//   } catch (error) {
//     console.error('Error signing up:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const signIn = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     });

//     if (error) throw error;

//     res.json({
//       success: true,
//       user: data.user,
//       session: data.session
//     });
//   } catch (error) {
//     console.error('Error signing in:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const signOut = async (req, res) => {
//   try {
//     const { error } = await supabase.auth.signOut();

//     if (error) throw error;

//     res.json({ success: true, message: 'Signed out successfully' });
//   } catch (error) {
//     console.error('Error signing out:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const getSession = async (req, res) => {
//   try {
//     const { session, user, error } = await supabase.auth.getSession();

//     if (error) throw error;

//     res.json({
//       success: true,
//       user: user,
//       session: session
//     });
//   } catch (error) {
//     console.error('Error getting session:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const refreshSession = async (req, res) => {
//   try {
//     const { refresh_token } = req.body;

//     const { data, error } = await supabase.auth.refreshSession({
//       refresh_token
//     });

//     if (error) throw error;

//     res.json({
//       success: true,
//       session: data.session,
//       user: data.user
//     });
//   } catch (error) {
//     console.error('Error refreshing session:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };
import { supabase } from '../integrations/supabaseClient.js';

export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) throw error;

    res.json({ success: true, data: data.user });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({
      success: true,
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getSession = async (req, res) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    res.json({
      success: true,
      session: session
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const refreshSession = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) throw error;

    res.json({
      success: true,
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Error refreshing session:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};