using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;


namespace ConsoleApp2
{
    class Program
    {
        private static string nick;
        private static EndPoint remotePoint;
        private static readonly Socket Socket = new(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        private static readonly List<string> Messages = new();
        private static Guid id;
        private static Guid guestId;
        private const char Separator = '|';


        private static void StartPage()
        {
            try
            {
                Console.WriteLine("Your nickname?");
                nick = Console.ReadLine();
                Console.WriteLine("Enter your port");
                var myPort = Convert.ToInt32(Console.ReadLine());
                Console.WriteLine("Enter ip of your contact");
                var ip = Console.ReadLine();
                Console.WriteLine("Enter port of your contact");
                var port = Convert.ToInt32(Console.ReadLine());
                Console.WriteLine("Do u already have your id? Y/any other");
                var key = Console.ReadKey().KeyChar;
                if (key == 'Y'||key=='y')
                {
                    Console.WriteLine("\nWrite your id to recover");
                    try
                    {
                        id = new Guid(Console.ReadLine());
                    }
                    catch (Exception ex)
                    {
                        Error(ex.Message);
                        StartPage();
                    }
                }
                else
                {
                    id = Guid.NewGuid();
                    Console.WriteLine($"\nYour generated id:\n{id}\nCopy it to recover message history in future.");
                    Console.ReadKey();
                }
                Socket.Bind(new IPEndPoint(IPAddress.Parse("127.0.0.1"), myPort));
                remotePoint = new IPEndPoint(IPAddress.Parse(ip), port);


            }
            catch
            {
                Error("Wrong format");
                Thread.Sleep(1500);
                StartPage();
            }
        }

        private static void ReceiveMessages()
        {
            try
            {
                while (true)
                {
                    StringBuilder value = new();
                    var data = new byte[256];
                    do
                    {
                        var bytes = Socket.ReceiveFrom(data, ref remotePoint);
                        value.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    }
                    while (Socket.Available > 0);
                    var temp = "";
                    for (var i = 0; i < value.Length; i++)
                    {
                        if (value[i] != Separator)
                        {
                            temp += value[i];
                        }
                        else
                        {
                            value.Remove(0, i + 1);
                            guestId = new Guid(temp);
                            AddMessage(new Guid(temp), value.ToString());
                            DisplayMessageHistory();
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Error(ex.Message);
            }
        }

        private static void SendMessage()
        {
            while (true)
            {
                var messageText = Console.ReadLine();
                var message = nick + ": " + messageText;
                if (guestId == default)
                {
                    Messages.Add(message);
                }
                else
                {
                    AddMessage(guestId, message);
                }
                DisplayMessageHistory();
                var data = Encoding.Unicode.GetBytes(id + Separator.ToString() + message);
                Socket.SendTo(data, remotePoint);
                Thread.Sleep(200);
            }
        }

        private static void Error(string errorMessage)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error. " + errorMessage);
            Console.ResetColor();
        }

        private static void DisplayMessageHistory()
        {
            Console.Clear();
            if (guestId == default)
            {
                foreach (var mes in Messages)
                {
                    Console.WriteLine(mes);
                }
                return;
            }

            if (Messages.Count != 0)
            {
                foreach (var mes in Messages)
                {
                    AddMessage(guestId, mes);
                }
                Messages.Clear();
            }
            try
            {
                string text = System.IO.File.ReadAllText(Environment.CurrentDirectory + $"/{id}-{guestId}.txt");
                Console.WriteLine(text);
            }
            catch
            {
                Error("Fail in reading history");
            }

        }

        static void AddMessage(Guid guestId, string message)
        {
            File.AppendAllText(Environment.CurrentDirectory + $"/{id}-{guestId}.txt", message + Environment.NewLine);
        }

        static void Main(string[] args)
        {
            StartPage();
            Thread receive = new(ReceiveMessages);
            receive.Start();
            Thread send = new(SendMessage);
            send.Start();
        }
    }
}