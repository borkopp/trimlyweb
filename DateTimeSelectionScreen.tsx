import {ActivityIndicator, ScrollView, TouchableOpacity, useColorScheme} from "react-native";
import React, {useState, useMemo, useEffect} from "react";
import {useAppointmentContext} from "./context/AppointmentContext";
import Colors from "@/src/constants/Colors";
import {View, Text} from "@/src/components/Themed";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import dayjs from "dayjs";
import CustomButton from "@/src/components/Button";
import PageTitle from "@/src/components/PageTitle";
import AnimatedProgressBar from "@/src/components/AnimatedProgressBar";
import {Calendar} from "react-native-calendars";
import {useBarberAvailability, useAvailabilitySubscription, useBarberUnavailableDates} from "@/src/api/barbershops/availability";
import {useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/src/lib/supabase";

const DateTimeSelectionScreen = () => {
  const colorScheme = useColorScheme();
  const {selectedBarber, selectedServices, selectedDate, setSelectedDate, selectedTime, setSelectedTime} = useAppointmentContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedTime("");
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
  }, []);

  const [selectedDateLocal, setSelectedDateLocal] = useState(selectedDate || dayjs().format("YYYY-MM-DD"));

  // Fetch availability data with caching
  const {data: availableSlots, isLoading} = useBarberAvailability(
    selectedBarber?.id || 0,
    selectedDateLocal,
    selectedServices.map((s) => s.id)
  );

  // Subscribe to real-time updates
  useAvailabilitySubscription(selectedBarber?.id || 0);
  const {data: unavailableDates = []} = useBarberUnavailableDates(selectedBarber?.id || 0);

  // Updated useEffect for initial date selection
  useEffect(() => {
    if (!selectedDate) {
      let date = dayjs();

      // Function to check if a date is disabled
      const isDateDisabled = (checkDate: dayjs.Dayjs) => {
        const dateString = checkDate.format("YYYY-MM-DD");

        // Check if it's a Sunday
        if (checkDate.day() === 0) return true;

        // Check if it's in unavailable dates
        return unavailableDates.some((unavailableDate) => unavailableDate.date === dateString);
      };

      // Find the next available date
      while (isDateDisabled(date)) {
        date = date.add(1, "day");
      }

      setSelectedDateLocal(date.format("YYYY-MM-DD"));
    }
  }, [selectedDate, unavailableDates]);

  // Prefetch next day's availability
  useEffect(() => {
    if (selectedBarber?.id && selectedDateLocal) {
      const nextDay = dayjs(selectedDateLocal).add(1, "day").format("YYYY-MM-DD");
      queryClient.prefetchQuery({
        queryKey: ["barber-availability", selectedBarber.id, nextDay, selectedServices.map((s) => s.id)],
        queryFn: async () => {
          const {data} = await supabase
            .from("barber_availability")
            .select("*")
            .eq("barber_id", selectedBarber.id)
            .eq("date", nextDay)
            .order("slot_time");
          return data || [];
        },
      });
    }
  }, [selectedDateLocal, selectedBarber?.id]);

  const handleDateSelect = (date: any) => {
    setSelectedDateLocal(date.dateString);
    setSelectedDate(date.dateString);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const formatTimeForDisplay = (timeString: string) => {
    try {
      // Ensure we're working with a valid time string (HH:mm:ss)
      const time = dayjs(`2000-01-01 ${timeString}`);
      if (!time.isValid()) {
        console.error("Invalid time:", timeString);
        return timeString;
      }
      return time.format("h:mm A");
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  const today = dayjs().format("YYYY-MM-DD");
  const futureDate = dayjs().add(60, "day").format("YYYY-MM-DD");

  // Function to disable Sundays
  const disabledDays = useMemo(() => {
    const disabled: {[key: string]: any} = {};
    let currentDate = dayjs(today);
    const endDate = dayjs(futureDate);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      // If it's Sunday (0 is Sunday in dayjs)
      if (currentDate.day() === 0) {
        disabled[currentDate.format("YYYY-MM-DD")] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
      currentDate = currentDate.add(1, "day");
    }

    unavailableDates.forEach((unavailableDate) => {
      disabled[unavailableDate.date] = {
        disabled: true,
        disableTouchEvent: true,
      };
    });

    return disabled;
  }, [today, futureDate, unavailableDates]);

  return (
    <SafeAreaView style={{backgroundColor: Colors[colorScheme ?? "light"].background}} className="h-full">
      <View className="p-5">
        <PageTitle title="Date Selection" subtitle="Select your desired date and time" />
      </View>
      {/* Progress Bar */}
      <AnimatedProgressBar step={3} totalSteps={4} steps={["Barber", "Service", "Date", "Review"]} />
      <View className="px-5 pt-5">
        <Calendar
          current={today}
          minDate={today}
          maxDate={futureDate}
          onDayPress={handleDateSelect}
          enableSwipeMonths={true}
          hideExtraDays={false}
          markedDates={{
            [selectedDateLocal]: {
              selected: true,
              selectedColor: Colors[colorScheme ?? "light"].primary,
            },
            ...disabledDays,
          }}
          disableAllTouchEventsForDisabledDays={true}
          theme={{
            calendarBackground: Colors[colorScheme ?? "light"].backgroundSecondary,
            textSectionTitleColor: Colors[colorScheme ?? "light"].text,
            selectedDayBackgroundColor: Colors[colorScheme ?? "light"].primary,
            selectedDayTextColor: "#ffffff",
            todayTextColor: Colors[colorScheme ?? "light"].primary,
            dayTextColor: Colors[colorScheme ?? "light"].text,
            textDisabledColor: Colors[colorScheme ?? "light"].backgroundTertiary,
            dotColor: Colors[colorScheme ?? "light"].primary,
            selectedDotColor: "#ffffff",
            arrowColor: Colors[colorScheme ?? "light"].primary,
            monthTextColor: Colors[colorScheme ?? "light"].text,
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
          style={{
            borderRadius: 15,
            overflow: "hidden",
            paddingVertical: 15,
          }}
        />
      </View>
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 20}}
          showsHorizontalScrollIndicator={false}
          className="flex-row pt-7 pb-2 space-x-3">
          {isLoading ? (
            <View className="flex-1 w-screen items-center justify-center py-4">
              <ActivityIndicator color={Colors[colorScheme ?? "light"].primary} />
            </View>
          ) : availableSlots && availableSlots.length > 0 ? (
            availableSlots
              .filter((slot) => slot.is_available)
              .map((slot) => {
                const displayTime = formatTimeForDisplay(slot.slot_time || "");

                return (
                  <TouchableOpacity
                    key={slot.slot_time}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor:
                        selectedTime === slot.slot_time ? Colors[colorScheme ?? "light"].primary : Colors[colorScheme ?? "light"].backgroundSecondary,
                    }}
                    className="shadow-sm p-3 rounded-xl"
                    onPress={() => handleTimeSelect(slot.slot_time || "")}>
                    <Text
                      className="font-semibold text-center"
                      style={{
                        fontSize: 16,
                        color: selectedTime === slot.slot_time ? "#ffffff" : Colors[colorScheme ?? "light"].text,
                      }}>
                      {displayTime}
                    </Text>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text style={{color: Colors[colorScheme ?? "light"].text}}>No available time slots for this date</Text>
          )}
        </ScrollView>
      </View>
      <View className="px-5">
        <CustomButton
          bgColor={Colors[colorScheme ?? "light"].backgroundSecondary}
          onPress={() => router.push("/(user)/appointmentBooking/AppointmentReview")}
          title="Next"
          disabled={!selectedTime || selectedTime === ""}
        />
      </View>
    </SafeAreaView>
  );
};

export default DateTimeSelectionScreen;
