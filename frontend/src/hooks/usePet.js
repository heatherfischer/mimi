import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petApi } from '../api/petApi';
import { useEffect, useRef } from 'react';

export const usePet = () => {
  const queryClient = useQueryClient();
  const tickIntervalRef = useRef(null);

  // Main query for pet state
  const query = useQuery({
    queryKey: ['pet'],
    queryFn: petApi.fetchPet,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Tick mutation for periodic updates
  const tickMutation = useMutation({
    mutationFn: petApi.tickPet,
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  // Set up tick interval
  useEffect(() => {
    tickIntervalRef.current = setInterval(() => {
      tickMutation.mutate();
    }, 10000); // Every 10 seconds

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, [tickMutation]);

  // Mutations for actions
  const feedMutation = useMutation({
    mutationFn: () => petApi.action('feed'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const playMutation = useMutation({
    mutationFn: () => petApi.action('play'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const cleanMutation = useMutation({
    mutationFn: () => petApi.action('clean'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const medicineMutation = useMutation({
    mutationFn: () => petApi.action('medicine'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const sleepMutation = useMutation({
    mutationFn: () => petApi.action('sleep'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const wakeMutation = useMutation({
    mutationFn: () => petApi.action('wake'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const coffeeMutation = useMutation({
    mutationFn: () => petApi.action('coffee'),
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  const resetMutation = useMutation({
    mutationFn: petApi.reset,
    onSuccess: (data) => {
      queryClient.setQueryData(['pet'], data);
    },
  });

  return {
    pet: query.data,
    isLoading: query.isLoading,
    error: query.error,
    feed: feedMutation.mutate,
    play: playMutation.mutate,
    clean: cleanMutation.mutate,
    medicine: medicineMutation.mutate,
    sleep: sleepMutation.mutate,
    wake: wakeMutation.mutate,
    coffee: coffeeMutation.mutate,
    reset: resetMutation.mutate,
    isMutating:
      feedMutation.isPending ||
      playMutation.isPending ||
      cleanMutation.isPending ||
      medicineMutation.isPending ||
      sleepMutation.isPending ||
      wakeMutation.isPending ||
      coffeeMutation.isPending ||
      resetMutation.isPending,
  };
};
