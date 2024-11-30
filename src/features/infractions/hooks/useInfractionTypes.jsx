import {useState, useEffect} from 'react';
import {typeInfraction} from '../../../api/infractionRequest';

export function useInfractionTypes() {
  const [infractionTypes, setInfractionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfractionTypes = async () => {
      try {
        setLoading(true);
        const res = await typeInfraction();
        setInfractionTypes(res.data);
      } catch (err) {
        setError(err);
        console.error('Error fetching infraction types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfractionTypes();
  }, []);

  return {infractionTypes, loading, error};
}
